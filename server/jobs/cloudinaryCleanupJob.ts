import cron from 'node-cron';
import cleanupImages from '../utils/cleanupImages';

const startCloudinaryCleanupJob = (): void => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running Cloudinary cleanup job...');

        cleanupImages().then(() => {
            console.log('Cleanup finished successfully!');
        }).catch(err => {
            console.error('Cleanup failed...', err)
        });
    });
};

export default startCloudinaryCleanupJob;
