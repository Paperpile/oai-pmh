// error class for OAI-PMH errors
class OaiPmhError extends Error {
  constructor (message, code) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.code = code
    Error.captureStackTrace(this, this.constructor.name)
  }
}

module.exports = {
  OaiPmhError
}
