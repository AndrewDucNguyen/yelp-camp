const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');

const validateCampground = (req, res, next) => {
    // Pass our data through the schema
    const {error} = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// List of all campgrounds
router.get('/', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

// Serves the form to create new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

// Creates the new campground to add to the list of all campgrounds
router.post('/', validateCampground, catchAsync( async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Shows one specific campground
router.get('/:id', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

// Serves the edit form
router.get('/:id/edit', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

// Replaces the entire campground with the specific id with the new updated one and puts it for that id
router.put('/:id', validateCampground, catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Deletes specific campground with associated id
router.delete('/:id', catchAsync( async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id).populate('reviews')
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}))

module.exports = router;