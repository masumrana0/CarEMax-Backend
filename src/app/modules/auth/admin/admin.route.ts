import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../../middlewares/ValidateRequest';
import { authValidationSchema } from '../auth.validation';
import auth from '../../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../../enums/role';

const router = express.Router();

router.post(
  '/register',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(authValidationSchema.adminRegisterZodSchema),
  AdminController.adminRegistration,
);

export const AdminRoutes = router;
