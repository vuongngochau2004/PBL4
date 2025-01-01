const expess = require('express');
const router = expess.Router();

const { 
  getLogin, 
  postLogin, 
  getRegister, 
  postRegister, 
  getLogout, 
  getForgotPassword, 
  postForgotPassword 
} = require('../../app/controllers/auth.controller');
const asyncMiddleware = require('../../middlewares/async.middleware');

router.route('/login')
  .get(asyncMiddleware(getLogin))
  .post(asyncMiddleware(postLogin));
router.route('/register')
  .get(asyncMiddleware(getRegister))
  .post(asyncMiddleware(postRegister));
router.route('/logout')
  .get(asyncMiddleware(getLogout));
router.route('/forgot-password')
  .get(asyncMiddleware(getForgotPassword))
  .post(asyncMiddleware(postForgotPassword));

module.exports = router;