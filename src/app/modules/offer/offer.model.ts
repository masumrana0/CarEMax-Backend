import { Schema, Types, model } from 'mongoose';
import { IOffer } from './offer.interface';

const PackageSchema = new Schema(
  {
    internet: {
      type: String,
      required: false,
    },
    voice: {
      type: String,
      required: false,
    },
  },
  { _id: false },
);

const OfferSchema = new Schema<IOffer>({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['normal offer', 'special offer', 'discount offer'],
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  package: {
    type: PackageSchema,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  discountPercentage: {
    type: String,
  },
  regularPrice: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  termsAndConditions: {
    type: [String],
    required: true,
  },
});

// Create and export the model based on the schema
export const Offer = model<IOffer>('Offer', OfferSchema);
