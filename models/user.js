const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// We don't need to add user and password above because of this method
// This adds onto the UserSchema
UserSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model('User', UserSchema);