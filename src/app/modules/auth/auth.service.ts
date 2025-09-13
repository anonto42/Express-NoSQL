// auth.service.ts
import { AuthRepository } from './auth.repository';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { htmlTemplate } from '../../../shared/htmlTemplate';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import bcrypt from 'bcrypt';
import ms, { StringValue } from "ms";
import { ILoginData, IVerifyEmail, IAuthResetPassword, IChangePassword } from '../../../types/auth';
import { STATUS } from '../../../enums/user';

export class AuthService {
  private authRepo: AuthRepository;

  constructor() {
    this.authRepo = new AuthRepository();
  }

  public async loginUser(payload: ILoginData) {
    const { email, password } = payload;
    const user = await this.authRepo.findUserByEmail(email, true);
    if (!user) throw new ApiError(400, "User doesn't exist");

    if (!user.verified) throw new ApiError(400, 'Please verify your account first');
    if ([STATUS.BLOCKED, STATUS.DELETED].includes(user.status)) {
      throw new ApiError(400, `Your account is ${user.status}`);
    }

    const isPasswordMatch = password && await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new ApiError(400, 'Password is incorrect');

    const accessToken = jwtHelper.createToken(
      { id: user._id, role: user.role, email: user.email },
      config.jwt.jwt_secret as Secret,
      config.jwt.jwt_expire_in as StringValue
    );

    const expireMs = ms(config.jwt.jwt_refresh_expire_in as StringValue)!;
    const refreshToken = jwtHelper.createToken(
      { id: user._id, role: user.role, email: user.email },
      config.jwt.jwt_secret as Secret,
      config.jwt.jwt_refresh_expire_in as StringValue
    );

    await this.authRepo.createResetToken(user._id, refreshToken, new Date(Date.now() + expireMs));

    user.password = '';
    user.authentication = undefined;
    return { accessToken, refreshToken, user };
  }

  public async refreshToken(refreshToken: string) {
    const tokenDoc = await this.authRepo.findValidResetToken(refreshToken);
    if (!tokenDoc) throw new ApiError(401, "Invalid or expired refresh token");

    const user = await this.authRepo.findUserById(tokenDoc.user);
    if (!user) throw new ApiError(401, "User not found");

    const newAccessToken = jwtHelper.createToken(
      { id: user._id, role: user.role, email: user.email },
      config.jwt.jwt_secret as Secret,
      config.jwt.jwt_expire_in as StringValue
    );

    return { newAccessToken };
  }

  public async forgetPassword(email: string) {
    const user = await this.authRepo.findUserByEmail(email);
    if (!user) throw new ApiError(400, "User doesn't exist");

    const otp = generateOTP(6);
    emailHelper.sendEmail(htmlTemplate.resetPassword({ otp, email: user.email }));

    const authentication = { oneTimeCode: otp, expireAt: new Date(Date.now() + 5 * 60000), isExistUser: true };
    await this.authRepo.updateUserById(user._id, { authentication });
  }

  public async verifyEmail(payload: IVerifyEmail) {
    const user = await this.authRepo.findUserByEmail(payload.email, true);
    if (!user) throw new ApiError(400, "User doesn't exist");

    if (!payload.oneTimeCode) throw new ApiError(400, "OTP is required");
    if (user.authentication?.oneTimeCode !== payload.oneTimeCode) throw new ApiError(400, "Wrong OTP");
    if (new Date() > user.authentication.expireAt!) throw new ApiError(400, "OTP expired");

    let data;
    if (user.authentication.isResetPassword) {
      await this.authRepo.updateUserById(user._id, { verified: true, authentication: { oneTimeCode: null, expireAt: null } });
    } else {
      const token = cryptoToken();
      await this.authRepo.createResetToken(user._id, token, new Date(Date.now() + 5 * 60000));
      await this.authRepo.updateUserById(user._id, { authentication: { isResetPassword: true, oneTimeCode: null, expireAt: null } });
      data = token;
    }
    return { data, message: 'Verification Successful' };
  }

  public async resetPassword(payload: IAuthResetPassword) {
    const tokenDoc = await this.authRepo.isTokenExist(payload.token);
    if (!tokenDoc) throw new ApiError(401, "Unauthorized");

    const user = await this.authRepo.findUserById(tokenDoc.user, true);
    if (!user?.authentication?.isResetPassword) throw new ApiError(401, "No permission");

    const isExpired = await this.authRepo.isTokenExpired(payload.token);
    if (isExpired) throw new ApiError(400, "Token expired");

    if (payload.newPassword !== payload.confirmPassword) throw new ApiError(400, "Passwords do not match");

    const hashPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
    await this.authRepo.updateUserById(user._id, { password: hashPassword, authentication: { isResetPassword: false } });
  }

  public async changePassword(user: JwtPayload, payload: IChangePassword) {
    const dbUser = await this.authRepo.findUserById(user.id, true);
    if (!dbUser) throw new ApiError(400, "User doesn't exist");

    const isMatch = await bcrypt.compare(payload.currentPassword, dbUser.password!);
    if (!isMatch) throw new ApiError(400, "Current password is incorrect");

    if (payload.currentPassword === payload.newPassword) throw new ApiError(400, "New password must be different");

    if (payload.newPassword !== payload.confirmPassword) throw new ApiError(400, "Passwords do not match");

    const hashPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
    await this.authRepo.updateUserById(user.id, { password: hashPassword });
  }
}
