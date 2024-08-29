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
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin' | 'super_admin';
  accountType?: 'personal' | 'business';
  documents?: string[];
  membership?: 'free' | 'faid';
  contactNo?: string;
  mainBalance?: number; //only for spendable but no withdrawable and non t ransferable
  earningBalance?: number; // withdrawable and transferable to main balance,
  rechargeEarningBalance?: number; // withdrawable and transferable to main balance, // it's only for bussiness account
  profilePhoto?: string;
  passwordChangedAt?: Date;
  isEmailVerified?: boolean;
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
