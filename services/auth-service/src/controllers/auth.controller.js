const authService = require('../services/auth.service');
const { signToken } = require('../config/jwt');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);

    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return res.status(200).json({
      success: true,
      data: {
        token,
        user
      }
    });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.status(200).json({
    success: true,
    data: req.user
  });
}

module.exports = {
  register,
  login,
  me
};