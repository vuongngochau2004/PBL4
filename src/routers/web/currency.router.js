const express = require('express');
const router = express.Router();
const { getData, getConvertCurtoVND} = require('../../app/controllers/web/currency.controller');
const asyncMiddleware = require('../../middlewares/async.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/:cur').get(asyncMiddleware(authMiddleware), asyncMiddleware(getData));
router.route('/:cur/convert').get(asyncMiddleware(authMiddleware), asyncMiddleware(getConvertCurtoVND) );

module.exports = router;