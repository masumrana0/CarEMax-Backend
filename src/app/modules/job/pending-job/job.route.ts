import express from 'express';
import auth from '../../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../../enums/role';
import { PendingJobController } from './job.controller';

const router = express.Router();

// pending to running job
router.patch(
  '/pending-to-running/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PendingJobController.pendingToRunningJobById,
);
// pending to  reject
router.patch(
  '/pending-to-reject/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  PendingJobController.pendingToRejectJobById,
);

router.get('/', PendingJobController.getAllPendingJob);
router.get('/:id', PendingJobController.getOnePendingJobById);

router.delete(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  PendingJobController.deletePendingJobById,
);

export const pendingJobRoutes = router;
