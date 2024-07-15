/**
 * Title: 'feedback service'
 * Description: ''
 * Author: 'Masum Rana'
 * Date: 01-01-2024
 *
 */

import { IFeedback } from './feedback.interface';
import { Feedback } from './feedback.model';

const createFeedback = async (
  payload: IFeedback,
): Promise<IFeedback | null> => {
  const feedback = await Feedback.create(payload);
  return feedback;
};

const getAllFeedback = async (): Promise<IFeedback[] | null> => {
  const getAllFeedback = await Feedback.find({});
  return getAllFeedback;
};

export const FeedbackService = {
  createFeedback,
  getAllFeedback,
};
