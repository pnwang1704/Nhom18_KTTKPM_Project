function register(req, res) {
  res.status(501).json({
    success: false,
    message: 'Register is not implemented yet.'
  });
}

function login(req, res) {
  res.status(501).json({
    success: false,
    message: 'Login is not implemented yet.'
  });
}

function refreshToken(req, res) {
  res.status(501).json({
    success: false,
    message: 'Refresh token is not implemented yet.'
  });
}

function logout(req, res) {
  res.status(501).json({
    success: false,
    message: 'Logout is not implemented yet.'
  });
}

function getProfile(req, res) {
  res.status(501).json({
    success: false,
    message: 'Profile endpoint is not implemented yet.'
  });
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile
};