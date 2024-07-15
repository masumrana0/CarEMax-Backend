import express from 'express';
import { AdminRoutes } from '../modules/auth/admin/admin.route';
import { CustomerthRoutes } from '../modules/auth/customer/customer.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { FeedBackRoutes } from '../modules/Feedback/feedback.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { UserRoutes } from '../modules/user/user.route';
import { FQARoutes } from '../modules/FQA/fqa.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/auth/customer',
    route: CustomerthRoutes,
  },
  {
    path: '/auth/admin',
    route: AdminRoutes,
  },
  {
    path: '/feedback',
    route: FeedBackRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/fqa',
    route: FQARoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
