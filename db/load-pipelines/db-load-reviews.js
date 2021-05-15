const ProductReview = require('../models/Reviews.js');
const fs = require('fs');
const { pipeline } = require('stream');
const split = require('split');


const reviewsReadStream = fs.createReadStream('../etl/writes/realReviews.json');

reviewsReadStream.pipe(split(JSON.parse))
  .on('data', (reviewObj) => {
    const newReview = new ProductReview({
      product_id: reviewObj.product_id,
      review_id: reviewObj.id,
      rating: reviewObj.rating,
      date: reviewObj.date,
      summary: reviewObj.summary,
      body: reviewObj.body,
      recommend: reviewObj.recommend,
      reported: reviewObj.reported,
      reviewer_name: reviewObj.reviewer_name,
      reviewer_email: reviewObj.reviewer_email,
      response: reviewObj.response,
      helpfulness: reviewObj.helpfulness,
      photos: []
    }).save().catch((err) => {console.log(err.message)});

  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log('///Reviews loading completed///');
  })

