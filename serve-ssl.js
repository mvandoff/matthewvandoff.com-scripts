require('dotenv').config();

const fs = require('fs');
const https = require('https');
const express = require('express');
const dns = require('node:dns');
const os = require('node:os');

const app = express();
app.use(express.static(process.env.SERVE_DIRECTORY || 'dist'));

const options = {
	key: fs.readFileSync(process.env.SSL_KEY_FILE_NAME, 'utf8'),
	cert: fs.readFileSync(process.env.SSL_CERT_FILE_NAME, 'utf8'),
	family: 4,
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
