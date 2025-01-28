const sanitizeInput = (req, res, next) => {
  req.body.name = req.body.name?.trim();
  req.body.description = req.body.description?.trim();
  next();
};

module.exports = { sanitizeInput };
