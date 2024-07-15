import { Schema, model } from 'mongoose';
import { IFQA } from './fqa.interface';

const FQASchema: Schema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: { type: String, required: true },
});

export const FQA = model<IFQA>('FQA', FQASchema);
