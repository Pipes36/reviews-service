const mongoose = require('mongoose');
const db = require('../index.js');
const fs = require('fs');

const groupedReviewSchema = new mongoose.Schema({
  product: {type: Number, required: true, unique: true},
  results: []
}, {collection: "reviewsGroupedByProductId"});

const GroupedReviews = mongoose.model('ProductReview', groupedReviewSchema);




module.exports = GroupedReviews;