const express = require('express');
const router = express.Router();
const { getData } = require('../../app/controllers/web/home.controller');
router.route('/')
.get(
  getData,
);

module.exports = router;