import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IProfile = {
  user: Types.ObjectId | IUser;
  name?: string;
  documents: string[];
  contactNo?: string;
  profilePhoto?: string;
  isVerified?: boolean;
};
