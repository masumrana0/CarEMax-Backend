import ApiError from '../../../../errors/ApiError';
import { IJobCategory } from './category.interface';
import { JobCategory } from './category.model';
import httpStatus from 'http-status';

// Create a new job category
const createJobCategory = async (
  payload: IJobCategory,
): Promise<IJobCategory | null> => {
  const result = await JobCategory.create(payload);
  return result;
};

// Get one job category by ID
const getJobCategoryById = async (id: string): Promise<IJobCategory | null> => {
  const result = await JobCategory.findById(id).exec();
  return result;
};

// Get all job categories
const getAllJobCategories = async (): Promise<IJobCategory[]> => {
  const result = await JobCategory.find({}).exec();
  return result;
};

// Update a job category
const updateJobCategory = async (
  id: string,
  payload: Partial<IJobCategory>,
): Promise<IJobCategory | null> => {
  const result = await JobCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).exec();
  return result;
};

// Delete a job category
const deleteJobCategory = async (id: string): Promise<IJobCategory | null> => {
  const isExistJobcategory = await JobCategory.findById(id).exec();
  if (!isExistJobcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job Category not found');
  }
  const result = await JobCategory.findByIdAndDelete(id).exec();
  return result;
};

// Delete a Sub Category
const deleteSubCategory = async (
  categoryId: string,
  subOptionId: string,
): Promise<IJobCategory | null> => {
  const isExistJobCategory = await JobCategory.findById(categoryId).exec();
  if (!isExistJobCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job Category not found');
  }

  // Remove the subOption with the specified ID from the subOption array
  const result = await JobCategory.findByIdAndUpdate(
    categoryId,
    { $pull: { subOption: { _id: subOptionId } } },
    { new: true },
  ).exec();

  return result;
};

export const jobCategoryService = {
  createJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  updateJobCategory,
  deleteJobCategory,
  deleteSubCategory,
};
