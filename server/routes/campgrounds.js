const express = require('express');
const router = express.Router();
const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');
const { getCampById, getCampgrounds, editCampground, deleteCampground, createCampground } = require('../controllers/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(getCampgrounds)
    .post(isLoggedIn, upload.array('image'), validateCampground, createCampground);

router.route('/:id')
    .get(getCampById)
    .put(isLoggedIn, isCampAuthor, upload.array('image'), validateCampground, editCampground)
    .delete(isLoggedIn, isCampAuthor, deleteCampground)

module.exports = router;