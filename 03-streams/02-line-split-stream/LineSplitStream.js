const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #str = '';

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    this.#str += chunk.toString();
    if (this.#str.includes(os.EOL)) {
      const arr = this.#str.split(os.EOL);
      this.#str = arr.pop();
      arr.forEach((r) => {
        this.push(r);
      });
    }

    callback();
  }

  _flush(callback) {
    callback(null, this.#str)
  }
}

module.exports = LineSplitStream;
