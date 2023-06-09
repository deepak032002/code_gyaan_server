import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "code_gyaan",
    public_id: (req, file) => "",
  },
});

const upload = multer({ storage: storage });

export default upload;
