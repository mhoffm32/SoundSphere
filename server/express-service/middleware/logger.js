/**
 * Logger middleware
 * Logs all requests to the console
 */
function logger(req, res, next) {
  console.log(`${req.method} request for ${req.url}`);

  next();
}

module.exports = logger;
