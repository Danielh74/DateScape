const cron = require('node-cron');
const cleanupImages = require('../utils/cleanupImages');

const startCloudinaryCleanupJob = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running Cloudinary cleanup job...');

        await cleanupImages();
    });
};

module.exports = startCloudinaryCleanupJob;