import httpStatus from 'http-status';

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import config from '../../../config';
import sendResponse from '../../../shared/sendResponse';
import {
  ILoginUserResponse,
  IDataValidationResponse,
  IRefreshTokenResponse,
} from './auth.interface';

// userLogin
const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthService.userLogin(loginData);

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
    message: 'User logged in successfully!',
    data: responseData,
  });
});

// refreshToken
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.getNewAccessToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
    data: null,
  });
});

// change password
const changeEmail = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { ...data } = req.body;

  const result = await AuthService.changeEmail(user, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Email changed successfully !',
    data: result,
  });
});

// ForgetPassword
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgetPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Please.Check your email!',
    data: null,
  });
});

// Reset Password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.params.token;

  await AuthService.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'your account is  recovered!',
    data: null,
  });
});

const sendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.sendVerificationEmail(req.body);
    // Handle validation errors
    if (result && 'validationResponse' in result) {
      sendResponse<IDataValidationResponse>(res, {
        statusCode: httpStatus.OK,
        success: false,
        message: 'Validation response',
        data: result,
      });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Please.Check your email!',
        data: null,
      });
    }
  },
);

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const token = req.params.token;

  await AuthService.verifyEmail(token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Congratulation.your account is Verified !',
    data: null,
  });
});
export const AuthController = {
  userLogin,
  getNewAccessToken,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
  forgetPassword,
  resetPassword,
  changeEmail,
};
