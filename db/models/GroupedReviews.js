const mongoose = require('mongoose');
const db = require('../index.js');

const groupedReviewSchema = new mongoose.Schema({
  product: {type: Number, required: true, unique: true},
  results: []
}, {collection: "reviewsGroupedByProductId"});

const GroupedReviews = mongoose.model('reviewsGroupedByProductId', groupedReviewSchema);



module.exports = GroupedReviews;