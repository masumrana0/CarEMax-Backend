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
import ApiError from '../../../../errors/ApiError';
import httpStatus from 'http-status';

// customer registration
const customerRegistration = async (
  payload: IUser,
): Promise<ILoginUserResponse> => {
  payload.role = 'customer';

  const isNotUniqueEmail = await User.isUserExist(payload.email);
  if (isNotUniqueEmail) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Sorry, this email address is already in use.',
    );
  }

  const session = await startSession();
  session.startTransaction();

  try {
    // Create User
    const user = await User.create(payload);

    await AuthService.sendVerificationEmail({
      email: user?.email,
      name: user?.name.firstName as string,
    });

    // Login User
    const loginData = { email: payload?.email, password: payload.password };
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
