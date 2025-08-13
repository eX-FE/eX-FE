module.exports = function errorHandler(err, _req, res, _next) {
  console.error('Error:', err);
  const status =
    err.status ||
    (err.message && /not found/i.test(err.message) ? 404 : 400);
  res.status(status).json({ error: err.message || 'Unknown error' });
};