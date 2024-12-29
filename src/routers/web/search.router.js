const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async.middleware');
const { searchData } = require('./../../app/controllers/web/home.controller');
router.route('/')
.get(asyncMiddleware(searchData))
module.exports = router;