function notFound(req, res) { res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` }); }
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.statusCode || (err.name === "ValidationError" ? 400 : err.code === 11000 ? 409 : 500);
  if (process.env.NODE_ENV !== "test") console.error(err.message);
  res.status(status).json({ success: false, message: status === 500 ? "Something went wrong" : err.message });
}
module.exports = { notFound, errorHandler };
