import { IProduct } from './product.interface';
import { Product } from './product.model';
// Create a new product
const createProduct = async (payload: IProduct): Promise<IProduct | null> => {
  const result = await Product.create(payload);
  return result;
};

// Get one product by ID
const getProductById = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id);
  return result;
};

// Get all products
const getAllProducts = async (): Promise<IProduct[] | null> => {
  const result = await Product.find({});
  return result;
};

// Update a product
const updateProduct = async (
  id: string,
  payload: Partial<IProduct>,
): Promise<IProduct | null> => {
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// Delete a product
const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
