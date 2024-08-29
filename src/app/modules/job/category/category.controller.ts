import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../shared/catchAsync';
import { jobCategoryService } from './category.service';
import { IJobCategory } from './category.interface';
import sendResponse from '../../../../shared/sendResponse';

// Create Job Category
const createJobCategory = catchAsync(async (req: Request, res: Response) => {
  const { ...jobCategoryData } = req.body;

  const result = await jobCategoryService.createJobCategory(jobCategoryData);
  sendResponse<IJobCategory>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job category created successfully!',
    data: result,
  });
});

// Get all job categories
const getAllJobCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await jobCategoryService.getAllJobCategories();
  sendResponse<IJobCategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job categories fetched successfully!',
    data: result,
  });
});

// Get job category by ID
const getJobCategoryById = catchAsync(async (req: Request, res: Response) => {
  const jobCategoryId = req.params.id;

  const result = await jobCategoryService.getJobCategoryById(jobCategoryId);
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Job category not found',
      data: null,
    });
  }

  sendResponse<IJobCategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job category fetched successfully!',
    data: result,
  });
});

// Update job category
const updateJobCategory = catchAsync(async (req: Request, res: Response) => {
  const jobCategoryId = req.params.id;
  const { ...jobCategoryData } = req.body;

  const result = await jobCategoryService.updateJobCategory(
    jobCategoryId,
    jobCategoryData,
  );
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Job category not found',
      data: null,
    });
  }

  sendResponse<IJobCategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job category updated successfully!',
    data: result,
  });
});

// Delete job category
const deleteJobCategory = catchAsync(async (req: Request, res: Response) => {
  const jobCategoryId = req.params.id;

  const result = await jobCategoryService.deleteJobCategory(jobCategoryId);

  sendResponse<IJobCategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job category deleted successfully!',
    data: result,
  });
});

const deleteJobSubCategory = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await jobCategoryService.deleteSubCategory(
    query.categoryId as string,
    query.subOptionId as string,
  );

  sendResponse<IJobCategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job sub category deleted successfully!',
    data: result,
  });
});

export const jobCategoryController = {
  createJobCategory,
  getAllJobCategories,
  deleteJobSubCategory,
  getJobCategoryById,
  updateJobCategory,
  deleteJobCategory,
};
