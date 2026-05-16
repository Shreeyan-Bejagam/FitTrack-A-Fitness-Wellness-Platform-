export function sendSuccess(res, statusCode, message, data = {}) {
  res.status(statusCode).json({ success: true, message, data })
}

export function sendError(res, statusCode, message, errors = null) {
  const body = { success: false, message }
  if (errors != null) body.errors = errors
  res.status(statusCode).json(body)
}
