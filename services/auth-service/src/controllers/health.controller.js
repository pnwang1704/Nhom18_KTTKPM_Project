function getHealth(req, res) {
  res.status(200).json({
    success: true,
    service: 'auth-service',
    status: 'ok'
  });
}

module.exports = {
  getHealth
};