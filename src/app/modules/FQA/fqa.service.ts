import { IFQA } from './fqa.interface';
import { FQA } from './fqa.model';

const createFQA = async (payload: IFQA): Promise<IFQA | null> => {
  const result = await FQA.create(payload);
  return result;
};

const getFQA = async (): Promise<IFQA[] | null> => {
  const result = await FQA.find({});
  return result;
};

export const FQAService = {
  createFQA,
  getFQA,
};
