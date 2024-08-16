import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

type IPackage = {
  internet?: string;
  voice?: string;
};

export type IOffer = {
  user: Types.ObjectId | string | IUser;
  category: 'normal offer' | 'special offer' | 'discount offer';
  operator: string;
  package: IPackage;
  banner: string;
  discountPercentage?: string;
  regularPrice: string;
  duration: string;
  termsAndConditions: string[];
};
