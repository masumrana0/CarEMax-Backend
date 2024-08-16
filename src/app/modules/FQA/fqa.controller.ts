import { Request, Response } from 'express';
// import { FileUploadHelper } from '../../../helper/FileUploadHelper';
const uploadFile = async (req: Request, res: Response) => {
  // console.log(req.files);
  console.log(req.body.data);

  // const uploads = await FileUploadHelper.uploadMultipleToCloudinary(
  //   req.files as IUploadFile[],
  // );
  // console.log(uploads);
  // const upload = await FileUploadHelper.uploadToCloudinary(
  //   req.file as IUploadFile,
  // );
  // console.log(upload);
  // // console.log(Date());
  res.send(req.body.data);
};

export const testingUploadController = {
  uploadFile,
};
