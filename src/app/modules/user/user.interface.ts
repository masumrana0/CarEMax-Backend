/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IProfile = {
  name?: string;
  documents: string[];
  contactNo?: string;
  profilePhoto?: string;
};

export type IUser = {
  _id?: string;
  name: {
    firstName: string;
    lastName?: string;
  };
  phoneNumber: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin' | 'super_admin';
  profilePhoto?: string;
  passwordChangedAt?: Date;
  isVerified?: boolean;
};

export type IUserFilters = {
  searchTerm?: string;
  role?: string;
  email?: string;
  accountType?: string;
  contactNo?: string;
  membership?: string;
};

export type UserModel = {
  isUserExist(email: string): Promise<IUser>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
