import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { productService } from './product.service'; // Adjust import path as needed
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IProduct } from './product.interface';

// Create Product
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const { ...productData } = req.body;

  const result = await productService.createProduct(productData);
  sendResponse<IProduct>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});

// Get all products
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getAllProducts();
  sendResponse<IProduct[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products fetched successfully!',
    data: result,
  });
});

// Get product by ID
const getProductById = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;

  const result = await productService.getProductById(productId);
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully!',
    data: result,
  });
});

// Update product
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const { ...productData } = req.body;

  const result = await productService.updateProduct(productId, productData);
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

// Delete product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;

  const result = await productService.deleteProduct(productId);
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
