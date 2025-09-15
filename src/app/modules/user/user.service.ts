import { UserRepository } from './user.repository';
import { IUser } from './user.interface';
import generateOTP from '../../../util/generateOTP';
import { emailHelper } from '../../../helpers/emailHelper';
import { htmlTemplate } from '../../../shared/htmlTemplate';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import unlinkFile from '../../../shared/unlinkFile';
import { USER_ROLES } from '../../../enums/user';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  public async createUser(payload: Partial<IUser>) {
    payload.role = USER_ROLES.USER;

    const existingUser = await this.userRepo.findByEmail(payload.email!);

    if (existingUser) {
      const otp = generateOTP(6);
      const values = { name: existingUser.name, otp, email: existingUser.email! };
      emailHelper.sendEmail(htmlTemplate.createAccount(values));

      await this.userRepo.update(existingUser._id, {
        password: payload.password,
        authentication: {
          oneTimeCode: otp,
          expireAt: new Date(Date.now() + 5 * 60_000),
          isResetPassword: false,
        },
      });

      return {
        message: 'OTP sent successfully!',
        statusCode: 409,
        user: { name: existingUser.name, email: existingUser.email, image: existingUser.image },
      };
    }

    const newUser = await this.userRepo.create(payload);
    const otp = generateOTP(6);
    emailHelper.sendEmail(htmlTemplate.createAccount({ name: newUser.name, otp, email: newUser.email! }));

    await this.userRepo.update(newUser._id, {
      authentication: {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 5 * 60_000),
        isResetPassword: false,
      },
    });

    return { name: newUser.name, email: newUser.email, image: newUser.image };
  }

  public async getUserProfile(user: JwtPayload) {
    const existingUser = await this.userRepo.findById(user.id!);
    if (!existingUser) throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
    return existingUser;
  }

  public async updateProfile(user: JwtPayload, payload: Partial<IUser>) {
    const existingUser = await this.userRepo.findById(user.id!);
    if (!existingUser) throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");

    if (payload.image) unlinkFile(existingUser.image!);

    return this.userRepo.update(user.id!, payload);
  }
}
