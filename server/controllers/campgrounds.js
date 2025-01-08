const Campground = require('../models/campground');
const handleAsyncError = require('../utils/handleAsyncError');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require('@maptiler/client');

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.getCampgrounds = handleAsyncError(async (req, res) => {
    const campgrounds = await Campground.find(
        req.query.campName
            ? { title: { $regex: req.query.campName, $options: 'i' } }
            : {}
    );
    res.send({ campgrounds, user: req.user, auth: res.auth });
});

module.exports.createCampground = handleAsyncError(async (req, res) => {
    const { title, location } = req.body.campground;
    const isExist = await Campground.exists({ title: title, location: location });
    if (isExist) {
        return res.status(400).send("Campground with this name at this location already exists")
    }
    const newCampground = new Campground(req.body.campground);
    const geoData = await maptilerClient.geocoding.forward(location, { limit: 1 });
    Object.assign(newCampground, {
        ...newCampground,
        geometry: geoData.features[0].geometry,
        images: req.files.map(img => ({ url: img.path, name: img.filename })),
        author: req.user._id
    });
    await newCampground.save();
    res.send({ newCampground, message: 'Campground was created' });
});

module.exports.getCampById = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author');
    if (!campground) {
        return res.status(404).send('Campground was not found');
    }
    res.send({ campground });
})

module.exports.editCampground = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    const currentCamp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    })
        .populate('author');;
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const formData = req.body.campground;
    const newImages = req.files.map(img => ({ url: img.path, filename: img.filename }));
    if (req.body.deleteImages) {
        for (const filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await currentCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    currentCamp.images.push(...newImages);
    Object.assign(currentCamp, {
        ...currentCamp,
        ...formData,
        geometry: geoData.features[0].geometry
    });
    await currentCamp.save();
    res.send({ campground: currentCamp });
})

module.exports.deleteCampground = handleAsyncError(async (req, res) => {
    const { id } = req.params;
    try {
        await Campground.findByIdAndDelete(id);
        res.status(200).send('Campground deleted successfully');
    } catch (e) {
        console.log(e)
        return res.status(404).send('Error:' + e);
    }
});