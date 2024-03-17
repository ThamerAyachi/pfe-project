const HTTPError = require("./HTTPError");

class UnauthorizedError extends HTTPError {
  constructor(message) {
    super(message || "Unauthorized", 401);
  }
}

module.exports = UnauthorizedError;
