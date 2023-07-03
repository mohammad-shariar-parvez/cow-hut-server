/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { gender } from './user.constants';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser>(
  {
    role: { type: String, enum: ['seller', 'buyer'], required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    name: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
    },
    gender: { type: String, enum: gender },
    address: { type: String },
    budget: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Exclude password field from the response
        return ret;
      },
    },
  }
);

UserSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<IUser | null> {
  return await User.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1, id: 1 }
  );
};

UserSchema.statics.isRefreshedAdminExist = async function (
  id: string
): Promise<IUser | null> {
  return await User.findById(id, {
    phoneNumber: 1,
    password: 1,
    role: 1,
    id: 1,
  });
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
  //hash password
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
