import { cloudinary } from '../cloudinary';
import CloudinaryCleanup from '../models/cloudinaryCleanup';

const cleanupImages = async (): Promise<void> => {
    const staleProcessingTime = new Date(Date.now() - 10 * 60 * 1000);

    while (true) {
        const image = await CloudinaryCleanup.findOneAndUpdate(
            {
                $or: [
                    { status: 'pending' },
                    {
                        status: 'processing',
                        lastAttempt: { $lt: staleProcessingTime }
                    }
                ]
            },
            {
                $set: {
                    status: 'processing',
                    lastAttempt: new Date()
                },
                $inc: { attempts: 1 }
            },
            { new: true }
        );

        if (!image) {
            break;
        }

        try {
            await cloudinary.uploader.destroy(image.filename);

            await CloudinaryCleanup.findByIdAndDelete(image._id);
        } catch (err) {
            console.error(
                `Failed to delete ${image.filename}:`,
                err instanceof Error ? err.message : err
            );

            await CloudinaryCleanup.findByIdAndUpdate(
                image._id,
                {
                    $set: {
                        status: 'pending'
                    }
                }
            );
        }
    }
};

export default cleanupImages;
