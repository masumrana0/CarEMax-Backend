import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const ProductSchema = new Schema<IProduct>({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  warranty: {
    type: String,
    required: false,
  },
  emi: {
    type: Number,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['in stock', 'out of stock'],
    default: 'in stock',
    required: true,
  },
});

// Create and export the model based on the schema
export const Product = model<IProduct>('Product', ProductSchema);
