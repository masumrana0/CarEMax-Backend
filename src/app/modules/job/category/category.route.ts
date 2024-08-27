import express from 'express';
import { ENUM_USER_ROLE } from '../../../../enums/role';
import { jobCategoryController } from './category.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

// Create Job Category
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  jobCategoryController.createJobCategory,
);

// Get all job categories
router.get('/', jobCategoryController.getAllJobCategories);

// Get job category by ID
router.get('/:id', jobCategoryController.getJobCategoryById);

// Update job category
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  jobCategoryController.updateJobCategory,
);

// Delete job category
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  jobCategoryController.deleteJobCategory,
);

export const jobCategoryRoute = router;
