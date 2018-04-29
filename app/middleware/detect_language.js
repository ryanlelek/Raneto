function detectLanguage(req, res, next) {
  res.locals = {};

  next();
}

module.exports = detectLanguage;
