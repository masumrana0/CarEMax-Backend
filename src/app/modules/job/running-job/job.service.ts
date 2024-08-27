import { addDays, addHours } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import { IJob, IJobFilters } from '../job.interface';
import { RunningJob } from '../job.model';
import { IPaginationOptions } from '../../../../inerfaces/pagination';
import { IGenericResponse } from '../../../../shared/sendResponse';
import { paginationHelpers } from '../../../../helper/paginationHelper';
import { jobSearchableFields } from '../job.constant';
import ApiError from '../../../../errors/ApiError';

const getAllRunningJob = async (
  filters: IJobFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IJob[]> | null> => {
  const { searchTerm, date, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search functionality using the searchTerm in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: jobSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Time filtering based on the createdAt field
  if (date && date !== 'all') {
    let dateCondition;
    const currentDate = new Date();

    switch (date) {
      case 'last hour':
        dateCondition = { $gte: addHours(currentDate, -1) };
        break;
      case 'last 24 hours':
        dateCondition = { $gte: addHours(currentDate, -24) };
        break;
      case 'last 7 days':
        dateCondition = { $gte: addDays(currentDate, -7) };
        break;
      case 'last 14 days':
        dateCondition = { $gte: addDays(currentDate, -14) };
        break;
      case 'last 30 days':
        dateCondition = { $gte: addDays(currentDate, -30) };
        break;
      default:
        dateCondition = {};
        break;
    }

    andConditions.push({ createdAt: dateCondition });
  }

  // Filtering based on other fields
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Dynamic sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  console.log(whereConditions);

  const result = await RunningJob.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await RunningJob.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getOneRunningJob = async (jobId: string): Promise<IJob | null> => {
  const result = await RunningJob.findById({ _id: jobId });
  return result;
};

const deleteRunningJob = async (
  tokenInfo: JwtPayload,
  id: string,
): Promise<IJob | null> => {
  const isJobExist = await RunningJob.findById(id);

  if (!isJobExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const result = await RunningJob.findByIdAndDelete(id);
  return result;
};

export const runningJobService = {
  getAllRunningJob,
  getOneRunningJob,
  deleteRunningJob,
};
