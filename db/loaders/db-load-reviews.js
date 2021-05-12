const ProductReview = require('../models/Reviews.js');
const fs = require('fs');
const { pipeline } = require('stream');
const split = require('split');


const reviewsReadStream = fs.createReadStream('../etl/writes/realReviews.json');
// const reviewPhotosStream = fs.createReadStream('../etl/writes/test-writes/dummyReviewPhotos.ndjson');

reviewsReadStream.pipe(split(JSON.parse))
  .on('data', (reviewObj) => {
    // console.log(reviewObj);
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









/*

const ProductReview = require('./Reviews.js');
const fs = require('fs');
const { pipeline } = require('stream');
const split = require('split');


const reviewsReadStream = fs.createReadStream('../etl/writes/test-writes/dummyReviews.ndjson');
const reviewPhotosStream = fs.createReadStream('../etl/writes/test-writes/dummyReviewPhotos.ndjson');

reviewsReadStream.pipe(split(JSON.parse))
  .on('data', (reviewObj) => {
    const product_id = reviewObj.product_id;
    const newReview = {
      product_id: product_id,
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
    };

    ProductReview.findOneAndUpdate(
      {product_id},
      {
        product_id,
        $push: {
          results: newReview
        }
      },
      {upsert: true}

    )
      .catch((err) => {
        console.log(err);
      });

  })
  .on('error', (err) => {
    console.log(err);
  })
  .on('end', () => {
    console.log('Process completed');
  })


// reviewPhotosStream.pipe(split(JSON.parse))
//   .on('data', (obj) => {
//     const targetReviewId = obj.review_id;
//     const photoURL = obj.url;

//     ProductReview.findOneAndUpdate(
//       {
//         results.review_id: targetReviewId
//       },
//       {
//         $push: {
//           results.photos: photoURL;
//         }
//       }
//     )
//   })

*/