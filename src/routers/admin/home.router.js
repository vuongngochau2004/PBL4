const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { getHome, getProfile, postProfile } = require('./../../app/controllers/admin/home.controller');
const asyncMiddleware = require('./../../middlewares/async.middleware');
const authMiddleware = require('./../../middlewares/auth.middleware');
const roleMiddleware = require('./../../middlewares/role.middleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/img');
    console.log(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.route('/').get(asyncMiddleware(authMiddleware), roleMiddleware(['admin']), asyncMiddleware(getHome));
router.route('/profile')
      .get(asyncMiddleware(authMiddleware), roleMiddleware(['admin']),  asyncMiddleware(getProfile))
      .post(asyncMiddleware(authMiddleware), roleMiddleware(['admin']), (req, res, next) => {
        upload.single('image')(req, res, (err) => {
          if (err) {
            console.error('Multer error:', err);
            return res.status(400).send('Error uploading file: ' + err.message);
          }
          next();
        });
      }, asyncMiddleware(postProfile));
module.exports = router;