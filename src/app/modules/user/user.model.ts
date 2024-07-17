/**
 * Title: 'user Schema'
 * Description: 'handle user Schema.and createing User Schema and  other fucntionalities'
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
    name: {
      type: String,
      required: true,
    },
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
    documents: {
      type: [String],
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    password: {
      type: String,
      required: true,
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

UserSchema.pre('save', async function (next) {
  // hasning user password
  this.password = await convertHashPassword(this.password);
  next();
});

// checking isUserExist
UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<IUser | null> {
  return await User.findOne(
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

//password Matching
UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', UserSchema);
