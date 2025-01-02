const express = require('express');
const router = express.Router();
const { getData } = require('../../app/controllers/web/home.controller');
const asyncMiddleware = require('../../middlewares/async.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/').get(asyncMiddleware(authMiddleware), asyncMiddleware(getData));

module.exports = router;