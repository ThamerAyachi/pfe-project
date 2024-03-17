const HTTPError = require("./HTTPError");

class NotFoundError extends HTTPError {
  constructor(message) {
    super(message || "Not Found", 404);
  }
}

module.exports = NotFoundError;
