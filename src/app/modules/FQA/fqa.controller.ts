import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IFQA } from './fqa.interface';
import httpStatus from 'http-status';
import { FQAService } from './fqa.service';

// get All Cleaning Product
const createFQA = catchAsync(async (req: Request, res: Response) => {
  const { ...fqaData } = req.body;

  const result = await FQAService.createFQA(fqaData);
  sendResponse<IFQA>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' FQA created successfully !',
    data: result,
  });
});

const getFQA = catchAsync(async (req: Request, res: Response) => {
  const result = await FQAService.getFQA();
  sendResponse<IFQA[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' FQA fatched successfully !',
    data: result,
  });
});

export const FQAController = {
  createFQA,
  getFQA,
};
