const mongoose = require('mongoose');
const db = require('../index.js');
const fs = require('fs');

const reviewPhotosSchema = new mongoose.Schema({
  review_id: {type: Number, unique: true},
  url: {type: String, required: true}
});

const ReviewPhotos = mongoose.model('ReviewPhotos', reviewPhotosSchema);



module.exports = ReviewPhotos;