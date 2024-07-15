/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  _id?: string;
  name: string;
  role?: 'customer' | 'admin' | 'super_admin';
  password: string;
  email: string;
  passwordChangedAt?: Date;
  isEmailVerified: boolean;
  profileImage?: string;
};

export type UserModel = {
  isUserExist(email: string): Promise<IUser>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
