import express from 'express';
import { FileUploadHelper } from '../../../../helper/FileUploadHelper';
import { jobOfWorkController } from './JobOfWork.controller';
import auth from '../../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../../enums/role';

const router = express.Router();

router.post(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
    ENUM_USER_ROLE.SUPER_ADMIN,
  ),
  FileUploadHelper.upload.array('files'),
  jobOfWorkController.submitJobOfWork,
);

export const jobOfWorkRoute = router;
