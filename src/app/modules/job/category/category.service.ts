import { IJobCategory } from './category.interface';
import { JobCategory } from './category.model';

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
  const result = await JobCategory.findByIdAndDelete(id).exec();
  return result;
};

export const jobCategoryService = {
  createJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  updateJobCategory,
  deleteJobCategory,
};
