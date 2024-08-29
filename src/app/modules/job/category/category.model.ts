import { Schema, model } from 'mongoose';
import { IJobCategory } from './category.interface';

// Define the main JobCategory schema
const JobCategorySchema = new Schema<IJobCategory>({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  subOption: {
    type: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        minCost: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
});

// Create and export the model based on the schema
export const JobCategory = model<IJobCategory>(
  'JobCategory',
  JobCategorySchema,
);
