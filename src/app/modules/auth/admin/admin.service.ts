/**
 * Title: 'Admin Authentication service'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 171-07-2024
 *
 */

import { IUser } from '../../user/user.interface';
import { User } from '../../user/user.model';
import { IDataValidationResponse } from '../auth.interface';
import { AuthService } from '../auth.service';
import validationResponse from '../../../../shared/validationResponse';
import { startSession } from 'mongoose';
import { ProfileService } from '../../profile/profile.service';

// user registration
const adminRegistration = async (
  payload: IUser,
): Promise<IUser | IDataValidationResponse> => {
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
    return user;
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
export const AdminService = {
  adminRegistration,
};
