import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { NextFunction, Request, Response } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

let uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file)
    return res
      .status(400)
      .send({ success: false, message: "[image] is required!" });

  const promise = new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file!.buffer).pipe(stream);
  });

  const { secure_url }: any = await promise;

  if (!secure_url) return res.status(400).send("Some problem occured!");
  req.file = secure_url;
  next();
};

export default uploadImage;
