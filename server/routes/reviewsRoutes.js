const express = require('express');
const router = express.Router();
const db = require('../../db');
const GroupedReviews = require('../../db/models/GroupedReviews.js');
const ProductReview = require('../../db/models/Reviews.js');


// TODO: Implement sorting
router.get('/', (req, res) => {
  const { product_id, sort } = req.query;
  const page = req.query.page || 1;
  const count = req.query.count || 5;

  // pagination logic variables:
  const startIndex = count * (page - 1);
  const endIndex = startIndex + count;

  const formattedResult = {};

  GroupedReviews.findOne({product: product_id})
    .then((queryResult) => {
      const relevantReviews = queryResult.results.filter((review) => !review.reported);

      queryResult.results = relevantReviews.slice(startIndex, endIndex);

      Object.assign(formattedResult, queryResult);
      formattedResult._doc.page = page;
      formattedResult._doc.count = count;

      res.status(200).send(formattedResult._doc);
    })
    .catch((err) => {
      console.log('error fetching reviews by product_id from DB', err);
      res.send(500);
    });

});


router.put('/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  let product; // product_id related to review_id

  ProductReview.findOne({review_id})
    .then((foundReview) => {
      product = foundReview.product_id; // noting down product_id
      foundReview.reported = !foundReview.reported;
      foundReview.save()

        .then(() => {
          GroupedReviews.findOne({product})
            .then((groupedReview) => {
              const reviews = groupedReview.results;
              for (let i = 0; i < reviews.length; i++) {

                if (reviews[i].review_id === Number(review_id)) {
                  reviews[i].reported = !reviews[i].reported;
                  break;
                }
              }
              groupedReview.markModified('results');
              groupedReview.save((err) => {
                if (err) {
                  console.log(err );
                } else {
                  console.log('//Review reported//');
                  res.sendStatus(200);
                }
              })
            })
    })
  })
  .catch((err) => {
    console.log(err);
  })
});


router.put('/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  let product; // product_id related to review_id

  ProductReview.findOne({review_id})
    .then((foundReview) => {
      product = foundReview.product_id; // noting down product_id
      foundReview.helpfulness++;
      foundReview.save()
        .then(() => {
          GroupedReviews.findOne({product})
            .then((groupedReview) => {
              const reviews = groupedReview.results;
              for (let i = 0; i < reviews.length; i++) {
                if (reviews[i].review_id === Number(review_id)) {
                  reviews[i].helpfulness++;
                  break;
                }
              }
              groupedReview.markModified('results');
              groupedReview.save((err) => {
                if (err) {
                  console.log(err );
                } else {
                  console.log('//Review marked as helpful//');
                  res.sendStatus(200);
                }
              })
            })
        })
    })
    .catch((err) => {
      console.log(err);
    })
});


module.exports = router;