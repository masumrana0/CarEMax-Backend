/**
 * Title: 'Profile Schema'
 * Description: 'Handles Profile Schema and related functionalities'
 * Author: 'Masum Rana'
 * Date: 29-12-2023
 *
 */

import { Schema, Types, model } from 'mongoose';
import { IProfile } from './profile.interface';

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    documents: {
      type: [String],
    },
    contactNo: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
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

// Pre-save middleware to update isVerified status
profileSchema.pre('save', function (next) {
  if (this.documents && this.documents.length > 0) {
    this.isVerified = true;
  } else {
    this.isVerified = false;
  }
  next();
});

export const Profile = model<IProfile>('Profile', profileSchema);
