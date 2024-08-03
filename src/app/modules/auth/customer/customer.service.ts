/**
 * Title: 'authentication service'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 29-12-2023
 *
 */

import { IUser } from '../../user/user.interface';
import { User } from '../../user/user.model';
import { ILoginUserResponse } from '../auth.interface';
import { AuthService } from '../auth.service';
import { startSession } from 'mongoose';
import { ProfileService } from '../../profile/profile.service';
import ApiError from '../../../../errors/ApiError';
import httpStatus from 'http-status';

// customer registration
const customerRegistration = async (
  payload: IUser,
): Promise<ILoginUserResponse> => {
  payload.role = 'customer';

  const { name, contactNo, ...userData } = payload;

  const isNotUniqueEmail = await User.isUserExist(payload.email);
  if (isNotUniqueEmail) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Sorry, this email address is already in use.',
    );
  }

  if (!payload.name) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'name is required');
  }

  const session = await startSession();
  session.startTransaction();

  try {
    // Create User
    const user = await User.create({ ...userData });

    // Create Profile
    const profile = await ProfileService.updateProfile(user?._id, {
      name: name,
      contactNo: contactNo,
    });

    await AuthService.sendVerificationEmail({
      email: user?.email,
      name: profile?.name as string,
    });

    // Login User
    const loginData = { email: userData?.email, password: userData.password };
    const result = await AuthService.userLogin(loginData);
    return result;

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const CustomerService = {
  customerRegistration,
};
