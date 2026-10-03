const { DateLocation } = require('../models/dateLocation');
const handleAsyncError = require('../utils/handleAsyncError');
const maptilerClient = require('@maptiler/client');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const CloudinaryCleanup = require('../models/cloudinaryCleanup');
const cleanupImages = require('../utils/cleanupImages');
const mongoose = require('mongoose');

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.getLocations = handleAsyncError(async (req, res) => {
    const { page: pageUrl, limit: limitUrl, category, locationName = '', sort = 'newest' } = req.query;
    const filter = {};

    const page = Math.max(Number(pageUrl) || 1, 1);
    const limit = Math.min(Math.max(Number(limitUrl) || 12, 1), 50);
    const skip = (page - 1) * limit;
    const sortBy = sort === 'rating'
        ? { averageRating: -1 }
        : { updatedAt: -1 };

    if (locationName) {
        const escapedSearch = locationName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        filter.title = {
            $regex: escapedSearch,
            $options: 'i'
        }
    };

    const categories = category
        ? Array.isArray(category)
            ? category
            : [category]
        : [];

    if (categories.length > 0) {
        filter.categories = {
            $in: categories
        };
    };

    const [locations, totalCount] = await Promise.all([
        DateLocation.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit),

        DateLocation.countDocuments(filter)
    ]);
    res.json({
        locations,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
    });
});

module.exports.getUserLocations = handleAsyncError(async (req, res) => {
    const { page: pageUrl, limit: limitUrl } = req.query;

    const page = Math.max(Number(pageUrl) || 1, 1);
    const limit = Math.min(Math.max(Number(limitUrl) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const filter = { author: req.user._id };

    const [userLocations, totalCount] = await Promise.all([

        DateLocation.find(filter)
            .skip(skip)
            .limit(limit),

        DateLocation.countDocuments(filter)
    ]);

    res.json({
        locations: userLocations,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
    });
});

module.exports.getFavorites = handleAsyncError(async (req, res) => {
    const { page: pageUrl, limit: limitUrl, category, locationName = '', sort = 'newest' } = req.query;
    const filter = {};

    const page = Math.max(Number(pageUrl) || 1, 1);
    const limit = Math.min(Math.max(Number(limitUrl) || 12, 1), 50);
    const skip = (page - 1) * limit;
    // const sortBy = sort === 'rating'
    //     ? { averageRating: -1 }
    //     : { updatedAt: -1 };

    // if (locationName) {
    //     const escapedSearch = locationName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    //     filter.title = {
    //         $regex: escapedSearch,
    //         $options: 'i'
    //     }
    // };

    // const categories = category
    //     ? Array.isArray(category)
    //         ? category
    //         : [category]
    //     : [];

    // if (categories.length > 0) {
    //     filter.categories = {
    //         $in: categories
    //     };
    // };

    const user = await User.findById(req.user._id);

    filter._id = { $in: user.favLocations }

    const [locations, totalCount] = await Promise.all([

        DateLocation.find(filter)
            .skip(skip)
            .limit(limit),

        DateLocation.countDocuments(filter)
    ]);

    res.json({
        favorites: locations,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
    });
});

module.exports.updateFavLocations = handleAsyncError(async (req, res) => {
    const { locationId } = req.body;

    if (!locationId) {
        throw new ExpressError(400, "Location ID is required");
    }

    const locationExist = await DateLocation.findById(locationId);

    if (!locationExist) {
        throw new ExpressError(400, "Location doesn't exist");
    }

    const user = await User.findById(req.user._id);

    const isFavorite = user.favLocations.some(id => id.equals(locationId))

    if (isFavorite) {
        user.favLocations.pull(locationId);
    } else {
        user.favLocations.addToSet(locationId);
    }

    await user.save();

    res.json({ user, message: 'Favorites updated successfully' });
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

    if (!currentLocation.author.equals(req.user._id)) {
        throw new ExpressError(403, "Unauthorized to edit location");
    }

    const newImages = req.files?.map(img => ({
        url: img.path,
        filename: img.filename
    })) ?? [];

    const deleteImages = req.body.deleteImages ?? [];

    const locationFilenames = currentLocation.images.map(img => img.filename);

    const hasInvalidImage = deleteImages.some(
        filename => !locationFilenames.includes(filename)
    );

    if (hasInvalidImage) {
        throw new ExpressError(400, "Invalid image");
    }

    const remainingImages = currentLocation.images.length - deleteImages.length + newImages.length;

    if (remainingImages <= 0) {
        throw new ExpressError(400, "Location must have at least one image");
    };

    const geoData = await maptilerClient.geocoding.forward(req.body.location.address, { limit: 1 });

    if (!(geoData.features && geoData.features.length > 0)) {
        throw new ExpressError(400, "Invalid address provided");
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        currentLocation.images = currentLocation.images.filter(
            img => !deleteImages.includes(img.filename));

        currentLocation.images.push(...newImages);

        const formData = req.body.location;

        Object.assign(currentLocation, {
            ...formData,
            geometry: geoData.features[0].geometry
        });

        await currentLocation.save({ session });

        if (deleteImages.length > 0) {
            await CloudinaryCleanup.insertMany(
                deleteImages.map(filename => ({ filename })),
                { session }
            );
        };

        await session.commitTransaction();

    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        await session.endSession();
    }

    if (deleteImages.length > 0) {
        cleanupImages().catch(err => {
            console.error('Cloudinary cleanup failed:', err);
        })
    };

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

    const locationToDelete = await DateLocation.findById(id);

    if (!locationToDelete) {
        throw new ExpressError(404, "Location was not found");
    }

    if (!locationToDelete.author.equals(req.user._id)) {
        throw new ExpressError(403, "Unauthorized to delete location");
    }

    const imagesToDelete = locationToDelete.images;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        await locationToDelete.deleteOne({ session });

        if (imagesToDelete.length > 0) {
            await CloudinaryCleanup.insertMany(
                imagesToDelete.map(img => ({ filename: img.filename })),
                { session }
            );
        };

        await session.commitTransaction();

        res.json('Location deleted successfully');

    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        await session.endSession();
    }

    if (imagesToDelete.length > 0) {
        cleanupImages().catch(err => {
            console.error('Cloudinary cleanup failed:', err);
        })
    };
});

