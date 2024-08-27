import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

type IDoc = {
  isRejected?: boolean;
  rejectedResion?: string;
};

export type IJob = {
  user?: Types.ObjectId | IUser;
  jobTitle: string;
  description: string;
  region: string;
  category: string;
  subCategory: string;
  steps: string[];
  workerNeeded: number;
  compleateJob?: number;
  workerEarn: number;
  showInterval: string;
  thumbnail?: string;
  doc?: IDoc;
};

export type IJobFilters = {
  searchTerm?: string;
  jobTitle?: string;
  category?: string;
  subCategory?: string;
  date?: string;
  region?: string;
};
