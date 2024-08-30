import { model, Schema, Types } from 'mongoose';
import { IJobOfWork } from './JobOfWork.interface';

const JobOfWorkSchema = new Schema<IJobOfWork>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: Types.ObjectId,
      ref: 'RunningJob',
      required: true,
    },
    note: {
      type: String,
      required: false,
      default: null,
    },
    proofs: [
      {
        title: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['screenshot proof', 'text proof'],
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const workOfJob = model<IJobOfWork>('JobOfWork', JobOfWorkSchema);
