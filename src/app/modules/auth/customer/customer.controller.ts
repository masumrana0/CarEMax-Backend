/**
 * Title: 'authentication controller'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 29-12-2023
 *
 */

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../../config';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { ILoginUserResponse } from '../auth.interface';
import { CustomerService } from './customer.service';

// customer registration with login
const customerRegistration = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  console.log(userData);
  // await AuthService.sendEmailVerificationMail(userData.email);
  const result = await CustomerService.customerRegistration(userData);

  const { refreshToken, accessToken, isEmailVerified } = result;
  const responseData = { accessToken, isEmailVerified };
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Registration in successfully !',
    data: responseData,
  });
});

export const CustomerController = {
  customerRegistration,
};
