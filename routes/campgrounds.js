const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const { storage } = require('../cloudinary');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

/*
// List of all campgrounds
router.get('/', catchAsync(campgrounds.index));

// Creates the new campground to add to the list of all campgrounds
router.post('/', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.createCampgrounds));

// Shows one specific campground
router.get('/:id', catchAsync(campgrounds.showCampground));

// Replaces the entire campground with the specific id with the new updated one and puts it for that id
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds));

// Deletes specific campground with associated id
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
*/

// You can use router.route to group together simliar routes
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, isAuthor, validateCampground, upload.array('image'), catchAsync(campgrounds.createCampgrounds));

// Serves the form to create new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get('/:id', catchAsync(campgrounds.showCampground))
    .put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds))
    .delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Serves the edit form
router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderEditForm));

module.exports = router;