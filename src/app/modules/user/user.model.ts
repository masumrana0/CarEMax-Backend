/**
 * Title: 'User Schema'
 * Description: 'Handle User Schema and create User Schema and other functionalities'
 * Author: 'Masum Rana'
 * Date: 29-12-2023
 *
 */

import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import { convertHashPassword } from '../../../helper/passwordSecurityHelper';

const UserSchema = new Schema<IUser>(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String }, // Optional lastName
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Prevents password from being returned in queries by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'super_admin'],
      default: 'customer', // Default to 'customer' if not provided
    },
    profilePhoto: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false, // Default to false if not provided
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
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
