// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';
// import { IClodinaryResponse, IUploadFile } from '../inerfaces/file';
// import * as fs from 'fs';

// // Configuration
// cloudinary.config({
//   cloud_name: 'da7ujmmwz',
//   api_key: '652413498683358',
//   api_secret: '15PrxUUbK2f6OSQXJ88vn1cUZDg',
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// const uploadSinleToCloudinary = async (
//   file: IUploadFile,
// ): Promise<string | null> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file.path,
//       (error: Error, result: IClodinaryResponse) => {
//         fs.unlinkSync(file.path);
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result?.url);
//         }
//       },
//     );
//   });
// };

// const uploadMultipleToCloudinary = async (
//   files: IUploadFile[],
// ): Promise<string[] | null> => {
//   const uploadPromises = files.map(
//     file =>
//       new Promise<IClodinaryResponse>((resolve, reject) => {
//         cloudinary.uploader.upload(
//           file.path,
//           (error: Error, result: IClodinaryResponse) => {
//             fs.unlinkSync(file.path);
//             if (error) {
//               reject(error);
//             } else if (result && result.url) {
//               resolve(result.url as never);
//             }
//           },
//         );
//       }),
//   );

//   const results = await Promise.all(uploadPromises);
//   return results as unknown as string[];
// };

// export const FileUploadHelper = {
//   uploadSinleToCloudinary,
//   uploadMultipleToCloudinary,
//   upload,
// };

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

import * as fs from 'fs';
import path from 'path';
import { IClodinaryResponse, IUploadFile } from '../inerfaces/file';

// Configuration
cloudinary.config({
  cloud_name: 'da7ujmmwz',
  api_key: '652413498683358',
  api_secret: '15PrxUUbK2f6OSQXJ88vn1cUZDg',
});

// Use a temporary directory in production environments like AWS Lambda
const uploadDir = path.join('/tmp', 'uploads');

// Ensure the uploads directory exists; if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the directory exists before storing the file
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Use the correct directory path
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save the file with its original name
  },
});

const upload = multer({ storage: storage });

const uploadSinleToCloudinary = async (
  file: IUploadFile,
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: IClodinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result?.url);
        }
      },
    );
  });
};

const uploadMultipleToCloudinary = async (
  files: IUploadFile[],
): Promise<string[] | null> => {
  const uploadPromises = files.map(
    file =>
      new Promise<IClodinaryResponse>((resolve, reject) => {
        cloudinary.uploader.upload(
          file.path,
          (error: Error, result: IClodinaryResponse) => {
            fs.unlinkSync(file.path);
            if (error) {
              reject(error);
            } else if (result && result.url) {
              resolve(result.url as never);
            }
          },
        );
      }),
  );

  const results = await Promise.all(uploadPromises);
  return results as unknown as string[];
};

export const FileUploadHelper = {
  uploadSinleToCloudinary,
  uploadMultipleToCloudinary,
  upload,
};
