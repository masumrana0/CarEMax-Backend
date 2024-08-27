import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse, {
  IGenericResponse,
} from '../../../../shared/sendResponse';
import { IJob } from '../job.interface';
import { IUploadFile } from '../../../../inerfaces/file';
import { pendingJobService } from './job.service';
import pick from '../../../../shared/pick';
import { jobFilterableFields } from '../job.constant';
import { paginationFields } from '../../../../constant/pagination';

const updatePendingJobById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user as JwtPayload;
  const data = JSON.parse(req.body?.data);

  const file = req.file as IUploadFile;

  console.log(id, user, data, file);

  const result = await pendingJobService.updatePendingJob(user, id, data, file);

  sendResponse<IJob>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'job  updated successfull!',
    data: result,
  });
});

const getOnePendingJobById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await pendingJobService.getOnePendingJob(id);

  sendResponse<IJob>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'job  fatched successfull!',
    data: result,
  });
});

const getAllPendingJob = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const filters = pick(query, jobFilterableFields);
  const paginationOptions = pick(query, paginationFields);
  const result = await pendingJobService.getAllPendingJob(
    filters,
    paginationOptions,
  );

  sendResponse<IGenericResponse<IJob[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'panding jobs  fatched successfull!',
    data: result,
  });
});

const deletePendingJobById = catchAsync(async (req: Request, res: Response) => {
  const tokenInfo = req.user as JwtPayload;
  const id = req.params.id;

  const result = await pendingJobService.deletePendingJob(tokenInfo, id);

  sendResponse<IJob>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'pending job  deleted successfull!',
    data: result,
  });
});

const pendingToRunningJobById = catchAsync(
  async (req: Request, res: Response) => {
    const tokenInfo = req.user as JwtPayload;
    const id = req.params.id;

    const result = await pendingJobService.pendingToRunningJob(tokenInfo, id);

    sendResponse<IJob>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        'The job has been successfully transitioned from pending to  running job.',
      data: result,
    });
  },
);

const pendingToRejectJobById = catchAsync(
  async (req: Request, res: Response) => {
    const tokenInfo = req.user as JwtPayload;
    const id = req.params.id;

    const result = await pendingJobService.pendingToReject(tokenInfo, id);

    sendResponse<IJob>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        'The job has been successfully transitioned from pending to  reject job.',
      data: result,
    });
  },
);

export const PendingJobController = {
  getAllPendingJob,
  getOnePendingJobById,
  updatePendingJobById,
  deletePendingJobById,
  pendingToRunningJobById,
  pendingToRejectJobById,
};
