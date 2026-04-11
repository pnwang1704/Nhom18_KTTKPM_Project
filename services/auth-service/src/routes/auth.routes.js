const router = require('express').Router();
const { register, login, refreshToken, logout, getProfile } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', getProfile);

module.exports = router;