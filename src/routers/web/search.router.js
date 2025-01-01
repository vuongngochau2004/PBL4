const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const { searchData } = require('./../../app/controllers/web/home.controller');
router.route('/')
.get(asyncMiddleware(authMiddleware), asyncMiddleware(searchData))
module.exports = router;