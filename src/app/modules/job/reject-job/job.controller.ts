import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse, {
  IGenericResponse,
} from '../../../../shared/sendResponse';
import { IJob } from '../job.interface';
import pick from '../../../../shared/pick';
import { jobFilterableFields } from '../job.constant';
import { paginationFields } from '../../../../constant/pagination';
import { RejectJobService } from './job.service';

const getOneRejectedJobById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await RejectJobService.getOneRejectJob(id);

    sendResponse<IJob>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'job  fatched successfull!',
      data: result,
    });
  },
);

const getAllRejectedJob = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const filters = pick(query, jobFilterableFields);
  const paginationOptions = pick(query, paginationFields);
  const result = await RejectJobService.getAllRejectJob(
    filters,
    paginationOptions,
  );

  sendResponse<IGenericResponse<IJob[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'rejected jobs  fatched successfull!',
    data: result,
  });
});

const deleteRejectedJobById = catchAsync(
  async (req: Request, res: Response) => {
    const tokenInfo = req.user as JwtPayload;
    const id = req.params.id;

    const result = await RejectJobService.deleteRejectJob(tokenInfo, id);

    sendResponse<IJob>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'rejected job  deleted successfull!',
      data: result,
    });
  },
);

export const RejectedJobController = {
  getOneRejectedJobById,
  getAllRejectedJob,
  deleteRejectedJobById,
};
