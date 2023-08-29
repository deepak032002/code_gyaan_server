import { v2 as cloudinary } from "cloudinary";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import sharp from "sharp";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});
const uploadImage = async (file: Express.Multer.File) => {
  return new Promise<UploadApiResponse | UploadApiErrorResponse>(
    (resolve, reject) => {
      let cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUD_UPLOAD_FOLDER,
          public_id:
            file.originalname.split(".")[0].split(" ").join("_") + "_codegyaan",
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );

      sharp(file.buffer)
        .webp({ quality: 20 })
        .toBuffer()
        .then((buffer) => {
          streamifier.createReadStream(buffer).pipe(cld_upload_stream);
        });
    },
  );
};

export default uploadImage;
