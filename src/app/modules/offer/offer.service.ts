import { IOffer } from './offer.interface';
import { Offer } from './offer.model';

// Create a new offer
const createOffer = async (payload: IOffer): Promise<IOffer | null> => {
  const result = await Offer.create(payload);
  return result;
};

// Get one offer by ID
const getOfferById = async (id: string): Promise<IOffer | null> => {
  const result = await Offer.findById(id);
  return result;
};

// Get all offers
const getAllOffers = async (): Promise<IOffer[] | null> => {
  const result = await Offer.find({});
  return result;
};

// Update an offer by ID
const updateOffer = async (
  id: string,
  payload: Partial<IOffer>,
): Promise<IOffer | null> => {
  const result = await Offer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// Delete an offer by ID
const deleteOffer = async (id: string): Promise<IOffer | null> => {
  const result = await Offer.findByIdAndDelete(id);
  return result;
};

export const offerService = {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};
