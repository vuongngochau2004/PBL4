const express = require('express');
const router = express.Router();
const { upload } = require('../../helpers/updoad.helper');

const { getHome, getProfile, postProfile } = require('./../../app/controllers/admin/home.controller');
const asyncMiddleware = require('../../middlewares/async.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const roleMiddleware = require('../../middlewares/role.middleware');

router.route('/').get(asyncMiddleware(authMiddleware), roleMiddleware(['admin']), asyncMiddleware(getHome));
router.route('/profile')
      .get(asyncMiddleware(authMiddleware), roleMiddleware(['admin']),  asyncMiddleware(getProfile))
      .post(asyncMiddleware(authMiddleware), roleMiddleware(['admin']), upload.single('image'), asyncMiddleware(postProfile));
module.exports = router;