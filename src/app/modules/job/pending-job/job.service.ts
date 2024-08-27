import { addDays, addHours } from 'date-fns';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder, startSession, Types } from 'mongoose';
import { IJob, IJobFilters } from '../job.interface';
import { IUploadFile } from '../../../../inerfaces/file';
import { FileUploadHelper } from '../../../../helper/FileUploadHelper';
import { PendingJob, RejectJob, RunningJob } from '../job.model';
import { IPaginationOptions } from '../../../../inerfaces/pagination';
import { IGenericResponse } from '../../../../shared/sendResponse';
import { paginationHelpers } from '../../../../helper/paginationHelper';
import { jobSearchableFields } from '../job.constant';
import ApiError from '../../../../errors/ApiError';

// get ALl Pending Job
const getAllPendingJob = async (
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
  if (date) {
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

  const result = await PendingJob.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await PendingJob.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get One Pending Job
const getOnePendingJob = async (jobId: string): Promise<IJob | null> => {
  const result = await PendingJob.findById({ _id: jobId });
  return result;
};

// Update pending Job
const updatePendingJob = async (
  tokenInfo: JwtPayload,
  id: string,
  payload?: Partial<IJob>,
  file?: IUploadFile,
): Promise<IJob | null> => {
  const isJobExist = await PendingJob.findById(id);

  if (!isJobExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  // Check authorization
  if (
    tokenInfo?.role !== 'super_admin' ||
    tokenInfo?.role !== 'admin' ||
    isJobExist?.user?.toString() !== tokenInfo?.userId
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  // Handle file upload if provided

  if (file) {
    const jobThumbnail = (await FileUploadHelper.uploadSinleToCloudinary(
      file,
    )) as string;
    const updatedJobData: Partial<IJob> = {
      ...payload,
      thumbnail: jobThumbnail,
    };
    return await PendingJob.findByIdAndUpdate(id, updatedJobData, {
      new: true,
    });
  }
  // Construct the updated job data
  const updatedJobData: Partial<IJob> = {
    ...payload,
  };

  // Update the job and return the result
  const updatedJob = await PendingJob.findByIdAndUpdate(id, updatedJobData, {
    new: true,
  });

  return updatedJob;
};

// delete pending job
const deletePendingJob = async (
  tokenInfo: JwtPayload,
  id: string,
): Promise<IJob | null> => {
  const isJobExist = await PendingJob.findById(id);

  if (!isJobExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  if (
    (tokenInfo?.role !== 'super_admin' && tokenInfo?.role !== 'admin') ||
    isJobExist?.user?.toString() !== tokenInfo?.userId
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await PendingJob.findByIdAndDelete(id);
  return result;
};

// pending to production
const pendingToRunningJob = async (
  tokenInfo: JwtPayload,
  id: string,
): Promise<IJob | null> => {
  const isJobExist = await PendingJob.findById(id);
  if (!isJobExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const session = await startSession();
  session.startTransaction();

  // Cast the object to make _id optional
  const jobData = isJobExist.toObject() as Omit<IJob, '_id'> &
    Partial<{ _id: Types.ObjectId }>;

  // Remove the _id field to avoid duplication conflicts
  delete jobData._id;

  // Insert the job into the production collection
  const result = await RunningJob.create([{ ...jobData }], { session });

  // Delete the job from the pending collection
  await PendingJob.findByIdAndDelete(id).session(session);

  // Commit the transaction
  await session.commitTransaction();
  session.endSession();

  return result[0];
};

// pending to reject
const pendingToReject = async (
  tokenInfo: JwtPayload,
  id: string,
): Promise<IJob | null> => {
  // Check if the job exists in the pending collection
  const isJobExist = await PendingJob.findById(id);
  if (!isJobExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const session = await startSession();
  session.startTransaction();

  // Insert the job into the RejectJob collection
  const [result] = await RejectJob.create([isJobExist.toObject()], {
    session,
  });

  // Delete the job from the pending collection
  await PendingJob.findByIdAndDelete(id).session(session);

  // Commit the transaction
  await session.commitTransaction();
  session.endSession();

  return result;
};

export const pendingJobService = {
  pendingToRunningJob,
  pendingToReject,
  updatePendingJob,
  deletePendingJob,
  getAllPendingJob,
  getOnePendingJob,
};
