import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { STATUS, USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [ 
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
        'Please provide a valid email address' 
      ],
    },
    contact:{
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
      select: 0,
      minlength: 8,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    authentication: {
      isResetPassword: {
        type: Boolean,
        default: false,
      },
      oneTimeCode: {
        type: Number,
        default: null,
      },
      expireAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//Check user With validation in shourt and return the user
userSchema.statics.isValidUser = async (id: string) => {
  const isExist = await User  
                        .findById( id)
                        .select("-password -authentication -__v -updatedAt -createdAt")
                        .lean()
                        .exec();

  if (!isExist) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "User not found"
    );
  };

  if (!isExist.verified) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Your account was not verified!"
    )
  };

  if (isExist.status !== STATUS.ACTIVE) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      `You account was ${isExist.status}!`
    );
  };
  return isExist;
};

userSchema.pre('save', async function (next) {
  
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

export const User = model<IUser, UserModal>('User', userSchema);
