const express = require('express');
const router = express.Router();

const { getUsers, getSearchUsers, postLockUser } = require('./../../app/controllers/admin/user.controller');
const asyncMiddleware = require('./../../middlewares/async.middleware');
const authMiddleware = require('./../../middlewares/auth.middleware');
const roleMiddleware = require('./../../middlewares/role.middleware');

router.route('/lock').post(asyncMiddleware(authMiddleware), roleMiddleware(['admin']),  asyncMiddleware(postLockUser));
router.route('/search').get(asyncMiddleware(authMiddleware), roleMiddleware(['admin']),  asyncMiddleware(getSearchUsers));
router.route('/').get(asyncMiddleware(authMiddleware), roleMiddleware(['admin']),  asyncMiddleware(getUsers));

module.exports = router;