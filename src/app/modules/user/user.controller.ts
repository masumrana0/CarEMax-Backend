import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IUser } from '../user/user.interface';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserService } from './user.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { userFilterableFields } from './user.constant';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully !',
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.getAllUser(filters, paginationOptions);

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user fetched successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getOneUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getOneUser(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user fatched successfully !',
    data: result,
  });
});

const updateUserByadmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { ...updatedData } = req.body;
  const result = await UserService.updateUserByadmin(id, updatedData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user updated successfully !',
    data: result,
  });
});

export const UserController = {
  getAllUser,
  getOneUser,
  updateUserByadmin,
  createUser,
};
