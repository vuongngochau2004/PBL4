const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const { getDataByBankId, getChartByBankId } = require('../../app/controllers/web/exchangeRate.controller');

router.route('/:id').get(asyncMiddleware(authMiddleware), asyncMiddleware(getDataByBankId));
router.route('/:id/chart').get(asyncMiddleware(authMiddleware), asyncMiddleware(getChartByBankId));

module.exports = router;