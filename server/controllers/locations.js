const DateLocation = require('../models/dateLocation');
const handleAsyncError = require('../utils/handleAsyncError');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require('@maptiler/client');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.getLocations = handleAsyncError(async (req, res) => {
    const { locationName = '' } = req.query;

    const locations = await DateLocation.find(
        {
            title: { $regex: locationName, $options: 'i' }
        }
    );
    res.json({ locations });
});

module.exports.getUserLocations = handleAsyncError(async (req, res) => {
    const userLocations = await DateLocation.find({ author: req.user._id });
    res.json({ locations: userLocations });
});

module.exports.getFavorites = handleAsyncError(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favLocations');
    res.json({ favorites: user.favLocations });
});

module.exports.updateFavLocations = handleAsyncError(async (req, res) => {
    const { locationId } = req.body;
    if (!locationId) {
        throw new ExpressError(400, "Location ID is required");
    }
    const user = await User.findById(req.user._id);

    if (user.favLocations.includes(locationId)) {
        await user.updateOne({ $pull: { favLocations: locationId } }, { new: true });
    } else {
        await user.updateOne({ $addToSet: { favLocations: locationId } }, { new: true });
    }

    const updatedUser = await User.findById(req.user._id);
    res.json({ user: updatedUser, message: 'Favorites updated successfully' });
});

module.exports.getLocationById = handleAsyncError(async (req, res) => {
    const { id } = req.params;

    const location = await DateLocation.findById(id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');
    if (!location) {
        throw new ExpressError(404, "Location was not found");
    }
    res.json({ location });
});

module.exports.createLocation = handleAsyncError(async (req, res) => {
    const { title, address } = req.body.location;

    const existingLocation = await DateLocation.findOne({ title: title, address: address });
    if (existingLocation) {
        throw new ExpressError(400, "Location with this name and this address already exists");
    }
    const newLocation = new DateLocation(req.body.location);
    const geoData = await maptilerClient.geocoding.forward(address, { limit: 1 });
    if (geoData.features && geoData.features.length > 0) {
        geometry = geoData.features[0].geometry;
    } else {
        throw new ExpressError(400, "Invalid address provided");
    }
    Object.assign(newLocation, {
        ...newLocation,
        geometry: geoData.features[0].geometry,
        images: req.files.map(img => ({ url: img.path, filename: img.filename })),
        author: req.user._id
    });
    await newLocation.save();
    res.json({ newLocation, message: 'Location was created' });
});

module.exports.editLocation = handleAsyncError(async (req, res) => {
    const { id } = req.params;

    const currentLocation = await DateLocation.findById(id);
    if (!currentLocation) {
        throw new ExpressError(404, "Location was not found");
    }

    const geoData = await maptilerClient.geocoding.forward(req.body.location.address, { limit: 1 });
    if (!(geoData.features && geoData.features.length > 0)) {
        throw new ExpressError(400, "Invalid address provided");
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
    res.json({ location: updatedLocation });
});

module.exports.deleteLocation = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    const deletedLocation = await DateLocation.findByIdAndDelete(id);
    if (!deletedLocation) {
        throw new ExpressError(404, "Location was not found");
    }
    res.json('Location deleted successfully');
});

