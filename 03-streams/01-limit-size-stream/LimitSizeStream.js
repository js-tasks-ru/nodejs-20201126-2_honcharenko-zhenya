const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #limit;
  #size = 0;

  constructor(options) {
    super(options);
    this.#limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.#size += Buffer.byteLength(chunk);
    if (this.#size > this.#limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
