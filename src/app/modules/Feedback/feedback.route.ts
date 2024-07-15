import express from 'express';
import validateRequest from '../../middlewares/ValidateRequest';
import { feedbackValidation } from './feedback.validation';
import { FeedbackController } from './feedback.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(feedbackValidation.feedBackZodValidationSchema),
  FeedbackController.createFeedback,
);

router.get('/', FeedbackController.getAllFeedback);

export const FeedBackRoutes = router;
