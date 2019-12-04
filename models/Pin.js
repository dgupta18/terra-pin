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
    }
});

var Pin = mongoose.model('Movie', pinSchema);
var Review = mongoose.model('Review', reviewSchema);

module.exports = {
    Pin: Pin,
    Review: Review
}