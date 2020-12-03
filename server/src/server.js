const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { getFiles, extractTokenFromBearer } = require('./helpers');

const API_KEY = process.env.APIKEY;
const FILES_DIR = '/media/data';
const PORT = 5000;

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILES_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(morgan('combined'));
app.use(express.json());

// Validates that the request has a valid API key, and returns a response with
// and auth token the dGraph expects.
app.post('/apikey', (req, res) => {
  if (API_KEY && req.header('X-API-Key') !== API_KEY) {
    res.sendStatus(401);
  }

  const authString = req.headers.authorization;
  const token = authString ? extractTokenFromBearer(authString) : '';

  res.set('X-Dgraph-AccessToken', token);
  res.status(200).send();
});

// Proxies an internal POST of the dGraph schema to the alpha dGraph instance.
app.post(
  '/admin/schema',
  createProxyMiddleware({
    target: 'http://alpha:8080/admin/schema',
    changeOrigin: true,
  })
);

// Returns a list of files stored on the server.
app.get('/files', (req, res) => {
  const fileList = getFiles(FILES_DIR);
  res.json(fileList);
});

// Deletes a file from the server.
app.delete('/file', (req, res) => {
  const path = `${FILES_DIR}/${req.body.fileName}`;
  fs.unlinkSync(path);
  res.send(200).send();
});

// Uploads a file to the server
app.post('/upload', upload.any(), (req, res, next) => {
  res.end();
});

app.listen(PORT, () => {
  console.log(`Instance API server listening at http://localhost:${PORT}`);
});
