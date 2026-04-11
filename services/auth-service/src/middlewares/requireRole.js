function requireRole(role) {
  return (req, res, next) => {
    return res.status(501).json({
      success: false,
      message: `Role guard for ${role} is reserved for the next iteration.`
    });
  };
}

module.exports = requireRole;