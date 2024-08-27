import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/role';
import { FileUploadHelper } from '../../../helper/FileUploadHelper';
import auth from '../../middlewares/auth';
import { JobController } from './job.controller';

const router = express.Router();

router.post(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  FileUploadHelper.upload.single('file'),
  JobController.createJob,
);

router.get('/', JobController.getAllJob);

router.get('/:id', JobController.getOneJObById);

export const JobRoutes = router;
