const mongoose = require('mongoose');
const db = require('./index.js');
const fs = require('fs');
const { pipeline } = require('stream');

const productReviewSchema = new mongoose.Schema({
  product_id: {type: Number, required: true},
  review_id: {type: Number, unique: true},
  rating: {type: Number, required: true},
  summary: {type: String, required: true},
  recommend: Boolean,
  response: {type: String, default: ''},
  reported: {type: Boolean},
  body: {type: String, required: true},
  date: Date,
  reviewer_name: {type: String, required: true},
  reviewer_email: {type: String, required: true},
  helpfulness: {type: Number, default: 0},
  photos: []
});

const ProductReview = mongoose.model('ProductReview', productReviewSchema);




module.exports = ProductReview;