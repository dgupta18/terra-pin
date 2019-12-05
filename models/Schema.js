var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    comment: {
        type: String
    },
    author: {
        type: String,
        required: true
    }
});

var pinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    onCampus: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    user: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    reviews: [reviewSchema]
});

var groupPinsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pins: [String]
});

var GroupPins = mongoose.model('GroupPin', groupPinsSchema)
var Pin = mongoose.model('Pin', pinSchema);
var Review = mongoose.model('Review', reviewSchema);

module.exports = {
    Pin: Pin,
    Review: Review,
    GroupPins: GroupPins
}