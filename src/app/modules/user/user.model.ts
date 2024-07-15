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

const UserSchema = new Schema<IUser, UserModel>(
  {
    role: {
      type: String,
      enum: userRole,
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
      select: 0,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// UserSchema.pre('save', async function (next) {
//   // hasning user password
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   if (this.isPasswordChanged) {
//     this.passwordChangedAt = new Date();
//   }
//   next();
// });

// checking isUserExist
UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<IUser | null> {
  return await User.findOne(
    { email: email },
    { _id: 1, password: 1, role: 1, email: 1, isEmailVerified: 1 },
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
