import express from 'express';
import auth from '../../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../../enums/role';
import { RejectedJobController } from './job.controller';

const router = express.Router();

router.get('/', RejectedJobController.getAllRejectedJob);
router.get('/:id', RejectedJobController.getOneRejectedJobById);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  RejectedJobController.deleteRejectedJobById,
);

export const rejectedJobRoutes = router;
