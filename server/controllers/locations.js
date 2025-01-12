const DateLocation = require('../models/dateLocation');
const handleAsyncError = require('../utils/handleAsyncError');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require('@maptiler/client');
const { categories: seedCategories } = require('../seeds/seedHelpers')

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.getLocations = handleAsyncError(async (req, res) => {
    const { locationName = '', categories = '' } = req.query;
    let categoriesArray = [];
    if (!categories) {
        categoriesArray = seedCategories;
    } else {
        categoriesArray = categories.split(',');
    }
    try {
        const locations = await DateLocation.find(
            {
                title: { $regex: locationName, $options: 'i' },
                categories: { $in: categoriesArray },
            }
        ).populate({
            path: 'reviews',
            populate: { path: 'author' }
        }).populate('author');
        res.send({ locations, user: req.user });
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }
});

module.exports.createLocation = handleAsyncError(async (req, res) => {
    const { title, address } = req.body.location;
    try {
        const isExist = await DateLocation.exists({ title: title, address: address });
        if (isExist) {
            return res.status(400).send("Location with this name at this address already exists")
        }
        const newLocation = new DateLocation(req.body.location);
        const geoData = await maptilerClient.geocoding.forward(address, { limit: 1 });
        if (geoData.features && geoData.features.length > 0) {
            geometry = geoData.features[0].geometry;
        } else {
            return res.status(400).send('Invalid address provided');
        }
        Object.assign(newLocation, {
            ...newLocation,
            geometry: geoData.features[0].geometry,
            images: req.files.map(img => ({ url: img.path, filename: img.filename })),
            author: req.user._id
        });
        await newLocation.save();
        res.send({ newLocation, message: 'Location was created' });
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }
});

module.exports.editLocation = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    try {
        const currentLocation = await DateLocation.findById(id);
        if (!currentLocation) {
            return res.status(404).send('Location was not found');
        }

        const geoData = await maptilerClient.geocoding.forward(req.body.location.address, { limit: 1 });
        if (!(geoData.features && geoData.features.length > 0)) {
            return res.status(400).send('Invalid address provided');
        }

        const newImages = req.files?.map(img => ({ url: img.path, filename: img.filename }));

        if (req.body.deleteImages) {
            for (const filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await currentLocation.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        }

        const formData = req.body.location;

        Object.assign(currentLocation, {
            ...formData,
            images: currentLocation.images,
            geometry: geoData.features[0].geometry
        });
        currentLocation.images.push(...newImages);

        await currentLocation.save();

        const updatedLocation = await DateLocation.findById(id)
            .populate({
                path: 'reviews',
                populate: { path: 'author' }
            })
            .populate('author');
        res.send({ location: updatedLocation });
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }
});

module.exports.getLocationById = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    try {
        const location = await DateLocation.findById(id)
            .populate({
                path: 'reviews',
                populate: { path: 'author' }
            })
            .populate('author');
        if (!location) {
            return res.status(404).send('Location was not found');
        }
        res.send({ location });
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }
})



module.exports.deleteLocation = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLocation = await DateLocation.findByIdAndDelete(id);
        if (!deletedLocation) {
            return res.status(404).send('Location was not found');
        }
        res.status(200).send('Location deleted successfully');
    } catch (e) {
        return res.status(500).send('Error:' + e);
    }
});