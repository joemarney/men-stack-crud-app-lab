const allowErrors = (req, res, next) => {
  res.locals.errors = {};
  res.locals.values = {};
  next();
};

module.exports = allowErrors;
