import express from 'express';
import { testingUploadController } from './fqa.controller';
import { FileUploadHelper } from '../../../helper/FileUploadHelper';

const router = express.Router();

router.post(
  '/',
  FileUploadHelper.upload.array('files'),
  testingUploadController.uploadFile,
);

export const testRoute = router;
