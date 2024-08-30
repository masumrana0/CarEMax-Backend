import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IJobCategory } from './category/category.interface';

type IDoc = {
  isRejected?: boolean;
  rejectedResion?: string;
};

export type IJob = {
  user?: Types.ObjectId | IUser;
  jobTitle: string;
  description: string;
  region: string;
  category: {
    _id: string | Types.ObjectId | IJobCategory;
    title: string;
  };
  subCategory: string;
  steps: string[];
  workerNeeded: number;
  completedJob?: number;
  workerEarn: number;
  showInterval: string;
  thumbnail?: string;
  doc?: IDoc;
  proofType: {
    title: string;
    type: 'screenshot proof' | 'text proof';
  }[];
};

export type IJobFilters = {
  searchTerm?: string;
  jobTitle?: string;
  category?: string;
  subCategory?: string;
  date?: string;
  region?: string;
};
