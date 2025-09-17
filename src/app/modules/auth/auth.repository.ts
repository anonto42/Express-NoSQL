import { User } from '../user/user.model';
import { ResetToken } from '../resetToken/resetToken.model';
import { Types } from 'mongoose';

export class AuthRepository {
    
  async findUserByEmail(email: string, selectPassword = false) {
    return selectPassword
      ? User.findOne({ email }).select('+password +authentication')
      : User.findOne({ email });
  }

  async findUserById(id: Types.ObjectId, selectPassword = false) {
    return selectPassword
      ? User.findById(id).select('+password +authentication')
      : User.findById(id);
  }

  async updateUserById(id: Types.ObjectId, payload: any) {
    return User.findByIdAndUpdate(id, payload, { new: true });
  }

  async saveUser(payload: any) {
    return User.create(payload);
  }

  // Reset token queries
  async createResetToken(userId: Types.ObjectId, token: string, expireAt: Date) {
    return ResetToken.create({ user: userId, token, expireAt });
  }

  async findValidResetToken(token: string) {
    return ResetToken.findOne({ token, expireAt: { $gt: new Date() } });
  }

  async isTokenExist(token: string) {
    return ResetToken.findOne({ token }).lean();
  }

  async isTokenExpired(token: string) {
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) return true;
    return resetToken.expireAt < new Date();
  }
}
