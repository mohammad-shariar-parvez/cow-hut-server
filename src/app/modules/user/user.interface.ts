import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  id?: string;
  role: 'seller' | 'buyer';
  phoneNumber: string;
  password: string;
  name: UserName;
  gender: 'male' | 'female';
  address: string;
  budget?: number;
  income?: number;
};

export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'phoneNumber' | 'password' | 'role'>>;
  isRefreshedUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'phoneNumber' | 'password' | 'role'>>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
