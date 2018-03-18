function detectLanguage(req, res, next) {
  console.log(req.cookies);

  res.locals = {};

  next();
}

module.exports = detectLanguage;
