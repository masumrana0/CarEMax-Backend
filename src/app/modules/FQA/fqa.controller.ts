import { Request, Response } from 'express';
import { FileUploadHelper } from '../../../helper/FileUploadHelper';
import { IUploadFile } from '../../../inerfaces/file';
const uploadFile = async (req: Request, res: Response) => {
  // console.log(req.files);
  // console.log(req.body.data);

  const uploads = await FileUploadHelper.uploadMultipleToCloudinary(
    req.files as IUploadFile[],
  );

  console.log(req.files);

  // console.log(uploads);
  // console.log(uploads);
  // const upload = await FileUploadHelper.uploadToCloudinary(
  //   req.file as IUploadFile,
  // );
  // console.log(upload);
  // // console.log(Date());
  res.send(uploads);
};

export const testingUploadController = {
  uploadFile,
};
