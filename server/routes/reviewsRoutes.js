const express = require('express');
const router = express.Router();
const db = require('../../db');
const GroupedReviews = require('../../db/models/GroupedReviews.js');

router.get('/', (req, res) => {
  const { product_id, sort } = req.query;
  const page = req.query.page || 1;
  const count = req.query.count || 5;

  // pagination helper variables:
  const startIndex = count * (page - 1);
  const endIndex = startIndex + count;

  const formattedResult = {};

  GroupedReviews.findOne({product: product_id})
    .then((queryResult) => {
      const reviews = queryResult.results.slice(startIndex, endIndex);
      queryResult.results = reviews;
      Object.assign(formattedResult, queryResult);
      formattedResult._doc.page = page;
      formattedResult._doc.count = count;
      res.status(200).send(formattedResult._doc);
    })
    .catch(err => console.log(err));

});



module.exports = router;
/*

Please include these params in GET requests to /reviews:

  page (int): Selects the page of results to return. Default 1.

  count (int): Specifies how many results per page. Default 5.

  sort (text): Change sort order by "newest", "helpful", or "relevant"

  product_id (int): Specifies product to retrieve reviews for.

Example request:

axios.get('/reviews', {
  params: {
    sort: "newest",
    product_id: 11001
  }
}
*/