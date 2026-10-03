import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Declared separately because multer-storage-cloudinary's Params type rejects known upload options as inline literals
const params = {
    folder: 'YelpCamp'
};

const storage = new CloudinaryStorage({
    cloudinary,
    params
});

export { cloudinary, storage };
