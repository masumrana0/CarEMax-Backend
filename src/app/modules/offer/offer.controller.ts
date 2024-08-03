import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IOffer } from './offer.interface';
import { offerService } from './offer.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// Create Offer
const createOffer = catchAsync(async (req: Request, res: Response) => {
  const { ...offerData } = req.body;

  const result = await offerService.createOffer(offerData);
  sendResponse<IOffer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer created successfully!',
    data: result,
  });
});

// Get all offers
const getAllOffers = catchAsync(async (req: Request, res: Response) => {
  const result = await offerService.getAllOffers();
  sendResponse<IOffer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offers fetched successfully!',
    data: result,
  });
});

// Get offer by ID
const getOfferById = catchAsync(async (req: Request, res: Response) => {
  const offerId = req.params.id;

  const result = await offerService.getOfferById(offerId);
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Offer not found',
      data: null,
    });
  }

  sendResponse<IOffer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer fetched successfully!',
    data: result,
  });
});

// Update offer
const updateOffer = catchAsync(async (req: Request, res: Response) => {
  const offerId = req.params.id;
  const { ...offerData } = req.body;

  const result = await offerService.updateOffer(offerId, offerData);
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Offer not found',
      data: null,
    });
  }

  sendResponse<IOffer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer updated successfully!',
    data: result,
  });
});

// Delete offer
const deleteOffer = catchAsync(async (req: Request, res: Response) => {
  const offerId = req.params.id;

  const result = await offerService.deleteOffer(offerId);
  if (!result) {
    return sendResponse<null>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Offer not found',
      data: null,
    });
  }

  sendResponse<IOffer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer deleted successfully!',
    data: result,
  });
});

export const offerController = {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};
