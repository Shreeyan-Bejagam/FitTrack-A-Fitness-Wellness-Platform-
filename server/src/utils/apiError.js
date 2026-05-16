export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {unknown[]} [errors]
   */
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.errors = errors
  }
}
