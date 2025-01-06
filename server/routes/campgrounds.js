const express = require('express');
const router = express.Router();
const { isAuthenticated, isCampAuthor, validateCampground } = require('../middleware');
const { getCampById, getCampgrounds, editCampground, deleteCampground, createCampground } = require('../controllers/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(getCampgrounds)
    .post(isAuthenticated, upload.array('images'), validateCampground, createCampground);

router.route('/:id')
    .get(getCampById)
    .put(isAuthenticated, isCampAuthor, upload.array('images'), validateCampground, editCampground)
    .delete(isAuthenticated, isCampAuthor, deleteCampground);

module.exports = router;