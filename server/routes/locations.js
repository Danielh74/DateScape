const express = require('express');
const router = express.Router();
const { isAuthenticated, isLocationAuthor, validateLocation, } = require('../middleware');
const { getLocationById, getLocations, editLocation, deleteLocation, createLocation, getFavorites, getUserLocations } = require('../controllers/locations');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(getLocations)
    .post(isAuthenticated, upload.array('images'), validateLocation, createLocation);

router.route('/userlocations')
    .get(isAuthenticated, getUserLocations);

router.route('/favorites')
    .get(isAuthenticated, getFavorites);

router.route('/:id')
    .get(getLocationById)
    .put(isAuthenticated, isLocationAuthor, upload.array('images'), validateLocation, editLocation)
    .delete(isAuthenticated, isLocationAuthor, deleteLocation);

module.exports = router;