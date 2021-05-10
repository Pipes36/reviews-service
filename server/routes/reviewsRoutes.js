const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const router = express.Router();
const db = require('../../db');
const GroupedReviews = require('../../db/models/GroupedReviews.js');
const ProductReview = require('../../db/models/Reviews.js');
const ProductMeta = require('../../db/models/ProductMeta.js');

// TODO: abstract out function(ality) from logic

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
                  res.sendStatus(204);
                }
              })
            })
    })
  })
  .catch((err) => {
    console.log('err while reporting review', err);
    res.send(500);
  })
});

//TODO: refactor - DRY
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
                  res.sendStatus(204);
                }
              })
            })
        })
    })
    .catch((err) => {
      console.log('err marking review as helpful', err);
      res.send(500);
    })
});



router.post('/', (req, res) => {

  // EXTRACT REVIEW DETAILS FROM REQ BODY
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics
  } = req.body;

  const uniqueId = uuidv4();
  const reviewTime = moment().format();
  console.log(`---- review_id generated: ${uniqueId} at ${reviewTime} ----`);

  // FORMAT INTO A NEW REVIEW OBJECT
  const formattedReview = {
    product_id: Number(product_id),
    rating: Number(rating),
    summary,
    body,
    recommend: (recommend === "true"),
    reviewer_name: name,
    reviewer_email: email,
    photos,
    response: "null",
    reported: false,
    helpfulness: 0,
    review_id: uniqueId,
    date: reviewTime
  };

  // SAVE AS STANDALONE REVIEW
  const newReview = new ProductReview (formattedReview);
  const saveReview = newReview.save((err) => {
    if (err) console.log('err saving new standalone review', err.message)
  })

  // PUSH NEW REVIEW INTO RELEVANT PRODUCT COLLECTION
  const saveReviewByProductId = GroupedReviews.find({product: product_id})
    .then((result) => {
      const product = result[0];
      product.results.push(formattedReview);
      product.markModified('results');
      product.save((err) => {
        if (err) console.log(err.message)
      })
    })
    .catch((err) => {
      if (err) console.log('err saving new review by product ID', err.message);
    });

  // UPDATE META DATA OF RELEVANT PRODUCT
  const updateMetaData = ProductMeta.findOne({product_id})
    .then((metaData) => {
      const ratings = metaData.ratings; // {}
      const recommends = metaData.recommend; // {}
      const characs = metaData.characteristics; // []

      ratings[rating]++;
      recommends[recommend.toString()]++

      for (let i = 0; i < characs.length; i++) {
        const currentCharacId = characs[i].characteristic_id;
        const newCharacScore = characteristics[currentCharacId];

        const count = characs[i].count++;
        const oldAvg = characs[i].avgValue;

        const newAvg = oldAvg * ((count-1) / count) + (newCharacScore / count);
        characs[i].avgValue = newAvg;
      }

      metaData.markModified('ratings');
      metaData.markModified('recommend');
      metaData.markModified('characteristics');

      metaData.save((err) => {
        if (err) console.log('err updating characteristic scores', err.message);
      })
    })
    .catch((err) => {
      console.log('err saving new review', err.message);
      res.send(500);
    });

  // ONCE ALL PROCESSES RESOLVED, SEND 201
  Promise.all([saveReview, saveReviewByProductId, updateMetaData])
    .then(() => {
      console.log('---- New review details saved! ----')
      res.send(201);
    })
    .catch((err) => {
      console.log('Error saving details from new review posted (POST/reviews route)');
      res.send(500);
    });

});


module.exports = router;

/*

  {
    product_id: integer,
    rating: integer,
    summary: string,
    body: string,
    recommend: bool,
    name: string,
    email: string,
    photos: [url, url, url],
    characteristics: {
      characteristic_id: int,
      characteristic_id: int
      characteristic_id: int
    }
  }

  {
    product_id: 1,
    rating: 5,
    summary: 'a new review by Pep',
    body: 'This is a test review, newly created by Pep.',
    recommend: true,
    name: PepPep,
    email: Pep@pepmail.com,
    photos: ['https://cdn.buttercms.com/ZF8K2t8hT8OoNR3W42bX', 'https://cdn.buttercms.com/ZF8K2t8hT8OoNR3W42bX'],
    characteristics: {
      1: 5,
      2: 5,
      3: 5,
      4: 5
    }
  }

  {"product_id":1,"rating":5,"summary":"a new review by Pep","body":"This is a test review, newly created by Pep.","recommend":true,"name":"PepPep","email":"Pep@pepmail.com","photos":["https://cdn.buttercms.com/ZF8K2t8hT8OoNR3W42bX","https://cdn.buttercms.com/ZF8K2t8hT8OoNR3W42bX"],"characteristics":{"1":5,"2":5,"3":5,"4":5}}

*/

