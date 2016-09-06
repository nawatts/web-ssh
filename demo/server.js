const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs');

const sshWsHandler = require('../server');

const REMOTE_HOST = '';
const REMOTE_USER = '';
const PATH_TO_KEY = '';

const app = express();
expressWs(app);

app.use(express.static(__dirname));

app.ws('/', sshWsHandler(() => ({
  host: REMOTE_HOST,
  port: 22,
  username: REMOTE_USER,
  privateKey: fs.readFileSync(PATH_TO_KEY),
})));

app.listen(5000);
