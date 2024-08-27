import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { paginationFields } from '../../../constant/pagination';
import { IUploadFile } from '../../../inerfaces/file';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse, { IGenericResponse } from '../../../shared/sendResponse';
import { jobFilterableFields } from './job.constant';
import { IJob } from './job.interface';
import { JobService } from './job.service';

const createJob = catchAsync(async (req: Request, res: Response) => {
  const tokenInfo = req.user as JwtPayload;

  const data = JSON.parse(req.body?.data);
  const file = req.file as IUploadFile;
  const result = await JobService.createJob(data, file, tokenInfo);

  sendResponse<IJob>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'job created successfully !',
    data: result,
  });
});

const getOneJObById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JobService.getOneJob(id);

  sendResponse<IJob>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'job  fatched successfull!',
    data: result,
  });
});

const getAllJob = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const filters = pick(query, jobFilterableFields);
  const paginationOptions = pick(query, paginationFields);
  const result = await JobService.getAllJob(filters, paginationOptions);

  sendResponse<IGenericResponse<IJob[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'jobs  fatched successfull!',
    data: result,
  });
});

export const JobController = {
  createJob,
  getOneJObById,
  getAllJob,
};
