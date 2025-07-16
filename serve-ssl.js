/*
This module creates an HTTPS web server and serves static content
from a specified directory on a specified port.
To generate a new cert:
  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
To remove the passphrase requirement:
  openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
Or just include the "passphrase" option when configuring the HTTPS server.
Sources:
- http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
- https://expressjs.com/en/starter/static-files.html
*/
require('dotenv').config()

const fs = require('fs');
const https = require('https');
const express = require('express');
const dns = require('node:dns');
const os = require('node:os');

const app = express();
app.use(express.static(process.env.SERVE_DIRECTORY || 'dist'));
// app.get('/', function(req, res) {
//   return res.end('<p>This server serves up static files.</p>');
// });

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE_NAME, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_FILE_NAME, 'utf8'),
  family: 4
};
const server = https.createServer(options, app);

server.listen(process.env.SERVER_PORT);

dns.lookup(os.hostname(), options, (err, addr) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running on: https://${addr}:${process.env.SERVER_PORT}`);
  }
});