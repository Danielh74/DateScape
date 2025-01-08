const express = require('express');
const router = express.Router();
const { isAuthenticated, isLocationAuthor, validateLocation, } = require('../middleware');
const { getLocationById, getLocations, editLocation, deleteLocation, createLocation } = require('../controllers/Locations')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(getLocations)
    .post(isAuthenticated, upload.array('images'), validateLocation, createLocation);

router.route('/:id')
    .get(getLocationById)
    .put(isAuthenticated, isLocationAuthor, upload.array('images'), validateLocation, editLocation)
    .delete(isAuthenticated, isLocationAuthor, deleteLocation);

module.exports = router;