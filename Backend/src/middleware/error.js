export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.issues) {
    return res.status(400).json({ error: 'ValidationError', details: err.issues });
  }
  res.status(500).json({ error: 'Internal Server Error' });
}
