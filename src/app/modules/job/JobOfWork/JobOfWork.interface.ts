import { Types } from 'mongoose';
import { IJob } from '../job.interface';
import { IUser } from '../../user/user.interface';

export type IJobOfWork = {
  user: Types.ObjectId | IUser | string;
  jobId: string | Types.ObjectId | IJob;
  note?: string;
  proofs: {
    title: string;
    type: 'screenshot proof' | 'text proof';
    value: string | string[] | null;
  }[];
};
