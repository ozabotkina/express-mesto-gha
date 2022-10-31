class Error403 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = Error403;
