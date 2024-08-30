import { FileUploadHelper } from '../../../../helper/FileUploadHelper';
import { IUploadFile } from '../../../../inerfaces/file';
import { IJobOfWork } from './JobOfWork.interface';
import { workOfJob } from './JobOfWork.model';

const submitJobOfWork = async (
  files: IUploadFile[],
  payload: IJobOfWork,
): Promise<IJobOfWork | null> => {
  const { proofs, ...otherData } = payload;
  // Upload files to Cloudinary and get the URLs in the same order
  const urls = (await FileUploadHelper.uploadMultipleToCloudinary(
    files,
  )) as string[];

  // Initialize a counter for the URLs
  let urlIndex = 0;

  const withImageUrlData = {
    ...otherData,
    proofs: proofs.map(proof => {
      if (proof.type === 'text proof') {
        return { type: proof.type, value: proof.value, title: proof.title };
      } else if (proof.type === 'screenshot proof') {
        return {
          type: proof.type,
          value: urls[urlIndex++],
          title: proof.title, // Assign the URL and increment the counter
        };
      }
    }),
  };

  const result = await workOfJob.create(withImageUrlData);
  return result;
};

export const jobOfWorkService = {
  submitJobOfWork,
};
