/**
 * Title: 'Feedback mongoose schema'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 01-01-2024
 *
 */

import { Schema, model } from 'mongoose';
import { IFeedback } from './feedback.interface';

// Mongoose schema for the IFeedback interface
const FeedbackSchema = new Schema<IFeedback>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// Mongoose model for 'Feedback' using FeedbackSchema
export const Feedback = model<IFeedback>('Feedback', FeedbackSchema);
