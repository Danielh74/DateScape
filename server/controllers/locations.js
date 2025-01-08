const DateLocation = require('../models/dateLocation');
const handleAsyncError = require('../utils/handleAsyncError');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require('@maptiler/client');

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.getLocations = handleAsyncError(async (req, res) => {
    try {
        const locations = await DateLocation.find(
            req.query.locationName
                ? { title: { $regex: req.query.locationName, $options: 'i' } }
                : {}
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

module.exports.editLocation = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    try {
        const currentLocation = await DateLocation.findById(id)
            .populate({
                path: 'reviews',
                populate: { path: 'author' }
            })
            .populate('author');
        if (!currentLocation) {
            return res.status(404).send('Location was not found');
        }
        const geoData = await maptilerClient.geocoding.forward(req.body.location.address, { limit: 1 });
        const formData = req.body.location;
        const newImages = req.files.map(img => ({ url: img.path, filename: img.filename }));
        if (req.body.deleteImages) {
            for (const filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await currentLocation.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        }
        currentLocation.images.push(...newImages);
        Object.assign(currentLocation, {
            ...currentLocation,
            ...formData,
            geometry: geoData.features[0].geometry
        });
        await currentLocation.save();
        res.send({ location: currentLocation });
    } catch (err) {
        res.status(500).send('Network Error: ' + err);
    }
});

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