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
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('No included directory');
        return;
      }

      const isFileExist = fs.existsSync(filepath);

      if (isFileExist) {
        res.statusCode = 409;
        res.end('File exist');
        return;
      }

      let isFileCreated = false;

      const onData = (chunk) => {
        writeStream.write(chunk);
      };

      const on500Err = () => {
        res.statusCode = 500;
        res.end('Server error');
      }

      const limitStream = new LimitSizeStream({limit: 2 ** 20, encoding: 'utf-8'});
      const writeStream = fs.createWriteStream(filepath);

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File uploaded correct!');
      });
      writeStream.on('error', () => {
        on500Err();
      });


      
      limitStream.on('data', onData);
      limitStream.on('end', () => {
        isFileCreated = true;
        writeStream.end();
      });
      limitStream.on('error', (err) => {
        writeStream.destroy();
        fs.unlink(filepath, (err) => {
          if (err) {
            on500Err();
          } else {
            res.statusCode = 413;
            res.end('File too big');
          }
        });
      });

      req.on('data', (chunk) => {
        limitStream.write(chunk);
      });
      req.on('end', () => {
        limitStream.end();
      });
      req.on('close', () => {
        if (!isFileCreated) {
          limitStream.destroy();
          writeStream.destroy();
          fs.unlink(filepath, () => {});
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
