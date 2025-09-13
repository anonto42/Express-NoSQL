import { User } from './user.model';
import { IUser } from './user.interface';
import { Types } from 'mongoose';

export class UserRepository {
  async findById(id: Types.ObjectId) {
    return User.findById(id).lean().exec();
  }

  async findByEmail(email: string) {
    return User.findOne({ email }).lean().exec();
  }

  async create(payload: Partial<IUser>) {
    return User.create(payload);
  }

  async update(id: Types.ObjectId, payload: Partial<IUser>) {
    return User.findByIdAndUpdate(id, payload, { new: true }).lean().exec();
  }

  async isExistById(id: Types.ObjectId) {
    return User.exists({ _id: id });
  }

  async isExistByEmail(email: string) {
    return User.exists({ email });
  }
}
