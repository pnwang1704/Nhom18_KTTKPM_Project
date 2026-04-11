function getHealth(req, res) {
  res.status(200).json({
    success: true,
    service: 'api-gateway',
    status: 'ok'
  });
}

module.exports = {
  getHealth
};