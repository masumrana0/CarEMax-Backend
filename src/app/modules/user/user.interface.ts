/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  _id?: string;
  name: string;
  role?: 'customer' | 'admin' | 'super_admin';
  accountType?: 'personal' | 'business';
  documents?: string[];
  membership?: 'free' | 'faid';
  contactNo?: string;
  balance?: number;
  password: string;
  email: string;
  passwordChangedAt?: Date;
  isEmailVerified: boolean;
};

export type UserModel = {
  isUserExist(email: string): Promise<IUser>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
