import express from 'express';
import { isAuthenticated, isLocationAuthor, validateLocation, } from '../middleware';
import { getLocationById, getLocations, editLocation, deleteLocation, createLocation, getFavorites, updateFavLocations, getUserLocations } from '../controllers/locations';
import multer from 'multer';
import { storage } from '../cloudinary';

const router = express.Router();
const upload = multer({ storage });

router.route('/')
    .get(getLocations)
    .post(isAuthenticated, upload.array('images'), validateLocation, createLocation);

router.route('/userlocations')
    .get(isAuthenticated, getUserLocations);

router.route('/favorites')
    .all(isAuthenticated)
    .get(getFavorites)
    .post(updateFavLocations);

router.route('/:id')
    .get(getLocationById)
    .put(isAuthenticated, isLocationAuthor, upload.array('images'), validateLocation, editLocation)
    .delete(isAuthenticated, isLocationAuthor, deleteLocation);

export default router;
