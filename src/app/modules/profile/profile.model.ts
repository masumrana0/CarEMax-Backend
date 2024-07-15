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
    },
    contactNo: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Profile = model<IProfile>('Profile', profileSchema);
