import express from 'express';
import validateRequest from '../../middlewares/ValidateRequest';
import { authValidationSchema } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/role';
import { CustomerController } from './customer/customer.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidationSchema.userLoginZodSchema),
  AuthController.userLogin,
);

router.post(
  '/customer/register',
  // validateRequest(authValidationSchema.customerRegisterZodSchema),
  CustomerController.customerRegistration,
);

router.post(
  '/get-new-accessToken',
  validateRequest(authValidationSchema.refreshTokenZodSchema),
  AuthController.getNewAccessToken,
);

router.patch(
  '/change-password',
  validateRequest(authValidationSchema.changePasswordZodSchema),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  AuthController.changePassword,
);

router.patch(
  '/change-email',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  AuthController.changeEmail,
);

router.post('/forget-password', AuthController.forgetPassword);

router.patch('/reset-password/:token', AuthController.resetPassword);

router.post(
  '/sendVerificationEmail',

  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  AuthController.sendVerificationEmail,
);
router.patch(
  '/verify-email/:token',

  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  AuthController.verifyEmail,
);

export const AuthRoutes = router;
