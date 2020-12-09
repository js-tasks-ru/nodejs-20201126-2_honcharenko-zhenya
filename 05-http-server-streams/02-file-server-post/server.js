const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const isFileExist = fs.existsSync(filepath);

      if (isFileExist) {
        res.statusCode = 409;
        res.end('File exist');
        return;
      }

      const onData = (chunk) => {
        writeStream.write(chunk);
      };

      const limitStream = new LimitSizeStream({limit: 2 ** 20, encoding: 'utf-8'});
      const writeStream = fs.createWriteStream(filepath);

      writeStream.on('finish', () => {
        res.statusCode = 200;
        res.end('File uploaded correct!');
      });

      limitStream.on('data', onData);

      limitStream.on('end', () => {
        writeStream.end();
      });

      limitStream.on('error', (err) => {
        res.statusCode = 413;
        res.end('File too big');
      });

      req.on('data', (chunk) => {
        limitStream.write(chunk);
      });
      req.on('end', () => {
        limitStream.end();
      });
      req.on('abort', () => {
        limitStream.destroy();
        writeStream.destroy();
      });
      // res.end('DO LATER');
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
