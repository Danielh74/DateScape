const cron = require('node-cron');
const cleanupImages = require('../utils/cleanupImages');

const startCloudinaryCleanupJob = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running Cloudinary cleanup job...');

        cleanupImages().then(() => {
            console.log('Cleanup finished successfully!');
        }).catch(err => {
            console.error('Cleanup failed...', err)
        });
    });
};

module.exports = startCloudinaryCleanupJob;