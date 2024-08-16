import express from 'express';
import { offerController } from './offer.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/role';
import { FileUploadHelper } from '../../../helper/FileUploadHelper';

const router = express.Router();

// Create Offer
router.post(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  FileUploadHelper.upload.single('file'),

  offerController.createOffer,
);

// Get all offers
router.get('/', offerController.getAllOffers);
router.get(
  '/my-offer',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  offerController.getSpecificUserOffer,
);

// Get offer by ID
router.get('/:id', offerController.getOfferById);

// Update offer
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FileUploadHelper.upload.single('file'),
  offerController.updateOffer,
);

// Delete offer
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  offerController.deleteOffer,
);

export const offerRoute = router;
