import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API__KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

export const imageUpload = async (dataUri) => {
  try {
    if (!dataUri) null;
    const response = await cloudinary.uploader.upload(dataUri);
    return response;
  } catch (error) {
    console.log(error.message);
  }
};
