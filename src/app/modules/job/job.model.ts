import { Schema, Types, model } from 'mongoose';
import { IJob } from './job.interface';

const JobSchema = new Schema<IJob>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    category: {
      _id: {
        type: Types.ObjectId,
        required: true,
        ref: 'JobCategory',
      },
      title: {
        type: String,
        required: true,
      },
    },
    subCategory: {
      type: String,
      required: true,
    },
    steps: {
      type: [String],
      required: true,
    },
    workerNeeded: {
      type: Number,
      required: true,
    },
    completedJob: {
      type: Number,
      default: 0,
    },
    workerEarn: {
      type: Number,
      required: true,
    },
    showInterval: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    proofType: [
      {
        title: { type: String, required: true },
        type: {
          type: String,
          enum: ['screenshot proof', 'text proof'],
          required: true,
        },
      },
    ],
    doc: {
      type: {
        isRejected: { type: Boolean, default: false },
        rejectedReason: { type: String },
      },
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Create and export the model based on the schema
export const RunningJob = model<IJob>('RunningJob', JobSchema);

export const PendingJob = model<IJob>('PendingJob', JobSchema);

export const RejectJob = model<IJob>('RejectJob', JobSchema);
