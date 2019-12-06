var mongoose = require('mongoose');

// NPM MODULE to find random documents
var random = require('mongoose-simple-random');


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
    },
    timeCreated: {
        type: String
    }
});

var pinSchema = new mongoose.Schema();

var recommendationSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    location: String,
    reason: {
        type: String,
        required: true
    }
});

pinSchema.add({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    onCampus: {
        type: Boolean,
        required: true
    },
    image: {
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
    avgRating: {
        type: Number,
        required: false
    },
    reviews: [reviewSchema],
    recommendations: [recommendationSchema]
});

pinSchema.plugin(random);


var Recommendation = mongoose.model('Recommendation', recommendationSchema)
var Pin = mongoose.model('Pin', pinSchema);
var Review = mongoose.model('Review', reviewSchema);

module.exports = {
    Pin: Pin,
    Review: Review,
    Recommendation: Recommendation
}