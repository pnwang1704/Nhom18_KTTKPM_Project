const router = require('express').Router();
const authRequired = require('../middlewares/authRequired');
const { 
  register, 
  login, 
  me, 
  forgotPassword, 
  resetPassword, 
  verifyOTP, 
  verifyRegistration,
  updateMe,
  getUsers
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/verify-registration', verifyRegistration);
router.get('/me', authRequired, me);
router.patch('/me', authRequired, updateMe);
router.get('/users', getUsers);

module.exports = router;