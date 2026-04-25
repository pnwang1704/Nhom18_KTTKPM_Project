const validateRequest = (schema) => (req, res, next) => {
  const errors = [];

  Object.keys(schema).forEach((field) => {
    if (schema[field].required && !req.body[field]) {
      errors.push(`${field} is required`);
    }

    if (schema[field].type === 'number' && req.body[field] && typeof req.body[field] !== 'number') {
      errors.push(`${field} must be a number`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

module.exports = validateRequest;
