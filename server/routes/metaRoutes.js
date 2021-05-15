const express = require('express');
const router = express.Router();
const db = require('../../db');
const ProductMeta = require('../../db/models/ProductMeta.js');

router.get('/', (req, res) => {

  const { product_id } = req.query;

  ProductMeta.findOne({product_id})
    .then((metaData) => {
      const inputCharac = metaData.characteristics;
      const outputCharac = {};
      inputCharac.map((charac) => {
        if (charac.count) {
          outputCharac[charac.name] = {
            value: charac.avgValue,
            count: charac.count,
            id: charac.characteristic_id
          };
        }
      });

      metaData.characteristics = outputCharac;
      res.status(200).send(metaData);

    })

});


module.exports = router;