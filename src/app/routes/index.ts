import express from 'express';
import { AdminRoutes } from '../modules/auth/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CustomerthRoutes } from '../modules/auth/customer/customer.route';
import { FQARoutes } from '../modules/FQA/fqa.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { UserRoutes } from '../modules/user/user.route';
import { headerCarouselSliderRoute } from '../modules/web-content/headerCarousel/headerCarousel.route';
import { offerRoute } from '../modules/offer/offer.route';

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
    path: '/web-content/headercarousel',
    route: headerCarouselSliderRoute,
  },
  {
    path: '/offer',
    route: offerRoute,
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
