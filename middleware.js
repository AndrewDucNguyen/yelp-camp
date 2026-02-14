const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./schemas');
const { reviewSchema } = require('../schemas');
const Campground = require('./models/campground');

module.exports.storeReturnTo = (req, res, next) => {
    console.log(req.session)
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    // Pass our data through the schema
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(id)) {
        req.flash("Can't do that")
        res.redirect(`/campgrounds/${id}`)
    }
    
    next();
}

module.exports.validateReview = (req, res, next) => {
    // Pass our data through the schema
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}