const HTTPError = require("./HTTPError");

class BadRequestError extends HTTPError {
  constructor(message) {
    super(message || "Bad Request", 400);
  }
}

module.exports = BadRequestError;
