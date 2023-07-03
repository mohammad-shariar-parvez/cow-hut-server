import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  id: string;
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: UserName;
  address: string;
};

export type AdminModel = {
  isUserExist(id: string): Promise<Pick<IAdmin, 'id' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;
