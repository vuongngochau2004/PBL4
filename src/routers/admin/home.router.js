const express = require('express');
const router = express.Router();

const { getHome } = require('./../../app/controllers/admin/home.controller');
const asyncMiddleware = require('./../../middlewares/async.middleware');


router.route('/')
  .get(asyncMiddleware(getHome));

module.exports = router;