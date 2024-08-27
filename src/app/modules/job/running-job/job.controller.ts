import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../../shared/catchAsync';
import sendResponse, {
  IGenericResponse,
} from '../../../../shared/sendResponse';
import { IJob } from '../job.interface';

import pick from '../../../../shared/pick';
import { jobFilterableFields } from '../job.constant';
import { paginationFields } from '../../../../constant/pagination';
import { runningJobService } from './job.service';

const getOneRunningJobById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await runningJobService.getOneRunningJob(id);

  sendResponse<IJob>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Running  fatched successfull!',
    data: result,
  });
});

const getAllRunningJob = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const filters = pick(query, jobFilterableFields);
  const paginationOptions = pick(query, paginationFields);
  const result = await runningJobService.getAllRunningJob(
    filters,
    paginationOptions,
  );

  sendResponse<IGenericResponse<IJob[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Running jobs  fatched successfull!',
    data: result,
  });
});

// const deletePendingJobById = catchAsync(async (req: Request, res: Response) => {
//   const tokenInfo = req.user as JwtPayload;
//   const id = req.params.id;

//   const result = await pendingJobService.deletePendingJob(tokenInfo, id);

//   sendResponse<IJob>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'pending job  deleted successfull!',
//     data: result,
//   });
// });

export const RunningJobController = {
  getAllRunningJob,
  getOneRunningJobById,
};
