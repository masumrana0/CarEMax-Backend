import express from 'express';
import { FQAController } from './fqa.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/role';

const router = express.Router();

router.get('/', FQAController.getFQA);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FQAController.createFQA,
);
export const FQARoutes = router;
