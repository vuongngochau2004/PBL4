const express = require('express');
const router = express.Router();

const { getHome, getUsers } = require('./../../app/controllers/admin/home.controller');
const asyncMiddleware = require('./../../middlewares/async.middleware');
const authMiddleware = require('./../../middlewares/auth.middleware');
const roleMiddleware = require('./../../middlewares/role.middleware');


router.route('/')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getHome));
router.route('/users')
  .get(asyncMiddleware(authMiddleware), asyncMiddleware(getUsers));
module.exports = router;