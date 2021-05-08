const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', (req, res) => {
  res.send('reviews route working');
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