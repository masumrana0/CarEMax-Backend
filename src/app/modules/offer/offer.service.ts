import { FileUploadHelper } from '../../../helper/FileUploadHelper';
import { IUploadFile } from '../../../inerfaces/file';
import { IOffer } from './offer.interface';
import { Offer } from './offer.model';

// Create a new offer
const createOffer = async (
  payload: IOffer,
  file: IUploadFile,
): Promise<IOffer | null> => {
  console.log(file);

  const url = await FileUploadHelper.uploadSinleToCloudinary(file);
  const offer = { ...payload, banner: url };

  const result = await Offer.create(offer);
  return result;
};

// Get one offer by ID
const getOfferById = async (id: string): Promise<IOffer | null> => {
  const result = await Offer.findById(id);
  return result;
};

// Get all offers
const getAllOffers = async (query?: string): Promise<IOffer[] | null> => {
  if (query) {
    const result = await Offer.find({ category: query });
    return result;
  }
  const result = await Offer.find({});
  return result;
};

const getSpecificUserOffer = async (id: string, query?: string) => {
  if (query) {
    const result = await Offer.find({ user: id, category: query });
    return result;
  }
  const result = await Offer.find({ user: id });
  return result;
};

// Update an offer
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

// Delete an offer
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
  getSpecificUserOffer,
};
