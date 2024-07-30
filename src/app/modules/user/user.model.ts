/**
 * Title: 'User Schema'
 * Description: 'Handle User Schema and create User Schema and other functionalities'
 * Author: 'Masum Rana'
 * Date: 29-12-2023
 *
 */

import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { userRole } from './user.constant';
import bcrypt from 'bcrypt';
import { convertHashPassword } from '../../../helper/passwordSecurityHelper';

const UserSchema = new Schema<IUser, UserModel>(
  {
    role: {
      type: String,
      enum: userRole,
      default: 'customer',
    },
    accountType: {
      type: String,
      enum: ['personal', 'business'],
      required: function () {
        return this.role === 'customer';
      },
    },
    membership: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Pre-save middleware to hash the password
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await convertHashPassword(this.password);
  }
  next();
});

// Static method to check if a user exists by email
UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<IUser | null> {
  return await this.findOne(
    { email: email },
    {
      _id: 1,
      password: 1,
      role: 1,
      accountType: 1,
      email: 1,
      isEmailVerified: 1,
    },
  );
};

// Static method to compare passwords
UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', UserSchema);
