import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { FeedbackService } from './feedback.service';
import sendResponse from '../../../shared/sendResponse';
import { IFeedback } from './feedback.interface';
import httpStatus from 'http-status';

const createFeedback = catchAsync(async (req: Request, res: Response) => {
  const { ...feedbackData } = req.body;
  const result = await FeedbackService.createFeedback(feedbackData);

  sendResponse<IFeedback>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User feedback post successfully !',
    data: result,
  });
});

const getAllFeedback = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.getAllFeedback();

  sendResponse<IFeedback[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'feedBack fatched successfully !',
    data: result,
  });
});

export const FeedbackController = {
  createFeedback,
  getAllFeedback,
};
