import express from 'express';
import { offerController } from './offer.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/role';

const router = express.Router();

// Create Offer
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),

  offerController.createOffer,
);

// Get all offers
router.get('/', offerController.getAllOffers);

// Get offer by ID
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  offerController.getOfferById,
);

// Update offer
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  offerController.updateOffer,
);

// Delete offer
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  offerController.deleteOffer,
);

export const offerRoute = router;
