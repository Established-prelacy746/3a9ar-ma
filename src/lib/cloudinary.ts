import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadPropertyImage(buffer: Buffer, publicId: string) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: "ar3ar/properties",
        transformation: [
          { width: 1600, crop: "limit" },
          { fetch_format: "webp", quality: "auto:good" },
        ],
      },
      (error, result) => (error ? reject(error) : resolve(result?.secure_url ?? "")),
    );
    stream.end(buffer);
  });
}
