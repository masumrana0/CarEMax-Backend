/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import {
  convertHashPassword,
  verifyPassword,
} from '../../../helper/passwordSecurityHelper';
import { sendMailerHelper } from '../../../helper/sendMailHelper';
import validationResponse from '../../../shared/validationResponse';
import { User } from '../user/user.model';
import {
  IChangePassword,
  IDataValidationResponse,
  IForgetPassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

// login user
const userLogin = async (
  payload: ILoginUser,
): Promise<ILoginUserResponse | IDataValidationResponse> => {
  const { email, password } = payload;

  // checking isUserExist
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    return validationResponse('User does not exist,Please create new account!');
  }

  // matching password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    return validationResponse('incorrect Password.Please try again');
  }

  // create accessToken & refresh token
  const { _id, role, email: Email, isEmailVerified } = isUserExist;

  // create accessToken
  const accessToken = jwtHelpers.createToken(
    {
      userId: _id,
      role: role,
      email: Email,
    },
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpireIn as string,
  );

  // create refreshToken
  const refreshToken = jwtHelpers.createToken(
    {
      userId: _id,
      role: role,
      email: Email,
    },
    config.jwt.refreshTokenSecret as Secret,
    config.jwt.refreshTokenExpireIn as string,
  );

  return {
    accessToken,
    refreshToken,
    isEmailVerified,
  };
};

// refresh Token
const getNewAccessToken = async (
  token: string,
): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refreshTokenSecret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { email: Email } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token

  const isUserExist = await User.isUserExist(Email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist._id,
      role: isUserExist.role,
      email: isUserExist.email,
    },
    config.jwt.accessTokenSecret as Secret,
    config.jwt.accessTokenExpireIn as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

// Change Password
const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<IDataValidationResponse | any> => {
  const { oldPassword, newPassword } = payload;

  // Find the user by ID and include the password field
  const isUserExist = await User.isUserExist(user?.email);

  if (!isUserExist) {
    return validationResponse('Sorry.User does not exist');
  }

  // Check if the old password matches
  const isCorrectPassword = await verifyPassword(
    oldPassword,
    isUserExist.password,
  );

  if (!isCorrectPassword) {
    return validationResponse(
      'your old password is incorrect.Please try again',
    );
  }

  const hashedNewPassword = await convertHashPassword(newPassword);

  // Update the user's password
  const isUpdatePassword = await User.findByIdAndUpdate(isUserExist._id, {
    password: hashedNewPassword,
  });

  if (!isUpdatePassword) {
    return validationResponse('Something is woring.Please try again');
  }
  // console.log(updatePassword);
};

// send verification email
const sendVerificationEmail = async (payload: {
  email: string;
  name?: string;
}): Promise<any | IDataValidationResponse> => {
  const { email } = payload;

  const isUserExist = await User.isUserExist(email);

  // checking is user existed
  if (!isUserExist) {
    return validationResponse('this user does not exist.');
  }

  const currentYear = new Date().getFullYear();

  const passVerificationToken = jwtHelpers.createResetToken(
    { userId: isUserExist._id, email: isUserExist.email },
    config.jwt.tokenSecret as string,
    '5m',
  );

  const verificationlink = `${config.verify_user_url}${passVerificationToken}`;

  const mailInfo = {
    to: email,
    subject: 'Secure Your Account: Verify Your Account',
    html: `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            width: 100px;
        }
        .content {
            text-align: left;
            line-height: 1.6;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="../../../../public/assets/logo.png" alt="Logo">
        </div>
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hi ${payload?.name},</p>
            <p>Thank you for signing up for [Your App Name]! To complete your registration, please verify your email address by clicking the button below:</p>
            <a  href="${verificationlink}" class="button">Verify Email</a>
           
            <p>Thank you,</p>
            <p>The FreeFexiPlan Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${currentYear}  FreeFexiPlan. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

  `,
  };

  await sendMailerHelper.sendMail(mailInfo);
};

// Reset Password
const verifyEmail = async (
  token: string,
): Promise<any | IDataValidationResponse> => {
  // Verify the token
  const isVerified = jwtHelpers.verifyToken(
    token,
    config.jwt.tokenSecret as string,
  );

  if (!isVerified) {
    return validationResponse('Invalid  or expired Link!. Please try again');
  }

  const { userId, email } = isVerified;
  const isUserExist = User.isUserExist(email);
  if (!isUserExist) {
    return validationResponse('Sorry something is wrong. Please try again');
  }

  // Update the user's password
  const setVerifiedEmail = await User.findByIdAndUpdate(
    { userId },
    { isEmailVerified: true },
  );

  if (!setVerifiedEmail) {
    return validationResponse('Something is wrong. Please try again');
  }
};

// ForgetPassword
const forgetPassword = async (
  payload: IForgetPassword,
): Promise<any | IDataValidationResponse> => {
  const { email } = payload;
  const isUserExist = await User.findOne({ email: email });

  // checking is user existed
  if (!isUserExist) {
    return validationResponse('this user does not exist.');
  }

  const passResetToken = jwtHelpers.createResetToken(
    {
      userId: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.tokenSecret as string,
    '5m',
  );

  const resetPasswordLink = `${config.reset_password_url}${passResetToken}`;

  const mailInfo = {
    to: email,
    subject: 'Secure Your Account: Reset Your Password Now',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #007bff;
                color: #ffffff;
                text-align: center;
                padding: 20px 0;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
            }
            .content {
                padding: 40px;
                color: #333333;
                font-size: 16px;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #666666;
                padding: 20px;
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
                background-color: #f0f0f0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Password Reset Verification</h2>
            </div>
            <div class="content">
               <p>Dear   ,</p>
                <p>We have received a request to reset the password for your account. To proceed with the password reset, click the button below:</p>
                <p style="text-align: center;"><a href="${resetPasswordLink}" class="button">Reset Password</a></p>
                <p>If you did not request this password reset, please ignore this message.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>[Your Company Name]</p>
            </div>
        </div>
    </body>
    </html>
  `,
  };

  await sendMailerHelper.sendMail(mailInfo);
};

// Reset Password
const resetPassword = async (
  payload: { newPassword: string },
  token: string,
): Promise<any | IDataValidationResponse> => {
  const { newPassword } = payload;

  // Verify the token
  const isVerified = jwtHelpers.verifyToken(
    token,
    config.jwt.tokenSecret as string,
  );

  if (!isVerified) {
    validationResponse('Invalid  or expired Link!');
  }

  const { userId } = isVerified;

  // Hash the new password
  const hashedPassword = await convertHashPassword(newPassword);

  // Update the user's password
  const isUpdatePassword = await User.findByIdAndUpdate(
    { userId },
    { password: hashedPassword },
  );

  if (!isUpdatePassword) {
    return validationResponse('something is wrong try again ');
  }
};

export const AuthService = {
  userLogin,
  getNewAccessToken,
  changePassword,
  verifyEmail,
  sendVerificationEmail,
  resetPassword,
  forgetPassword,
};
