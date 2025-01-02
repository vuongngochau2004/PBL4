const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async.middleware');
const authMiddleware = require('../../middlewares/auth.middleware');
const { getProfile, postProfile } = require('../../app/controllers/web/home.controller');
const { upload } = require('../../helpers/updoad.helper');

router.route('/')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getProfile))
  .post(asyncMiddleware(authMiddleware), upload.single('image'), asyncMiddleware(postProfile));

module.exports = router;