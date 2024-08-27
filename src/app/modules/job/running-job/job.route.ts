import express from 'express';
import { RunningJobController } from './job.controller';

const router = express.Router();

router.get('/', RunningJobController.getAllRunningJob);
router.get('/:id', RunningJobController.getOneRunningJobById);

// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
//    .deletePendingJobById,
// );

export const RunningJobRoutes = router;
