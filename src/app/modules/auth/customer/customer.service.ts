/**
 * Title: 'authentication service'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 29-12-2023
 *
 */

import { IUser } from '../../user/user.interface';
import { User } from '../../user/user.model';
import { IDataValidationResponse, ILoginUserResponse } from '../auth.interface';
import { AuthService } from '../auth.service';
import validationResponse from '../../../../shared/validationResponse';
import { startSession } from 'mongoose';
import { ProfileService } from '../../profile/profile.service';

// customer registration
const customerRegistration = async (
  payload: IUser,
): Promise<ILoginUserResponse | IDataValidationResponse> => {
  payload.role = 'customer';

  const { name, ...userData } = payload;

  const isNotUniqueEmail = await User.isUserExist(payload.email);
  if (isNotUniqueEmail) {
    return validationResponse('Sorry, this email address is already in use.');
  }

  if (!payload.name) {
    return validationResponse('name is required');
  }

  const session = await startSession();
  session.startTransaction();

  try {
    // Create User
    const user = await User.create({ ...userData });

    await AuthService.sendVerificationEmail({ email: user?.email });

    // Create Profile
    await ProfileService.updateProfile(user?._id, { name: name });

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
