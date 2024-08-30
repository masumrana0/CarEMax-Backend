import { Request, Response } from 'express';
import catchAsync from '../../../../shared/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import sendResponse from '../../../../shared/sendResponse';
import { IJobOfWork } from './JobOfWork.interface';
import httpStatus from 'http-status';
import { IUploadFile } from '../../../../inerfaces/file';
import { jobOfWorkService } from './JobOfWork.service';

const submitJobOfWork = catchAsync(async (req: Request, res: Response) => {
  const tokenInfo = req.user as JwtPayload;
  const data = JSON.parse(req.body?.data);
  console.log(data);

  const payload = { user: tokenInfo?.userId, ...data } as IJobOfWork;
  const files = req.files as IUploadFile[];

  const result = await jobOfWorkService.submitJobOfWork(files, payload);

  sendResponse<IJobOfWork>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'your work submited successful.',
    data: result,
  });
});

export const jobOfWorkController = {
  submitJobOfWork,
};
