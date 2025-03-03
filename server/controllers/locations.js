const DateLocation = require('../models/dateLocation');
const handleAsyncError = require('../utils/handleAsyncError');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require('@maptiler/client');
const { categories: seedCategories } = require('../seeds/seedHelpers');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const limit = 12;

module.exports.getLocations = handleAsyncError(async (req, res) => {
    const { locationName = '', categories = '' } = req.query;
    let categoriesArray = [];
    if (!categories) {
        categoriesArray = seedCategories;
    } else {
        categoriesArray = categories.split(',');
    }
    const locations = await DateLocation.find(
        {
            title: { $regex: locationName, $options: 'i' },
            categories: { $in: categoriesArray },
        }
    );

    const total = await DateLocation.countDocuments();
    res.send({ locations, pages: Math.ceil(total / limit), limit });
});

module.exports.getUserLocations = handleAsyncError(async (req, res) => {
    const userLocations = await DateLocation.find({ author: req.user._id });
    const total = userLocations.length;
    res.send({ locations: userLocations, pages: Math.ceil(total / limit), limit });
});

module.exports.getFavorites = handleAsyncError(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favLocations');
    const total = user.favLocations.length;
    res.send({ favorites: user.favLocations, pages: Math.ceil(total / limit), limit });
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
    res.send({ location });
});

module.exports.createLocation = handleAsyncError(async (req, res) => {
    const { title, address } = req.body.location;

    const existingLocation = await DateLocation.findOne({ title: title, address: address });
    if (existingLocation) {
        throw new ExpressError(400, "Location with this name and this address already exists");
    }
    const newLocation = new DateLocation(req.body.location);
    const geoData = await maptilerClient.geocoding.forward(address, { limit: 1 });
    console.log(geoData.features);
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
    res.send({ newLocation, message: 'Location was created' });
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
    res.send({ location: updatedLocation });
});

module.exports.deleteLocation = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    const deletedLocation = await DateLocation.findByIdAndDelete(id);
    if (!deletedLocation) {
        throw new ExpressError(404, "Location was not found");
    }
    res.send('Location deleted successfully');
});

