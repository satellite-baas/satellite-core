const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { getFiles } = require('./helpers');

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

app.get('/files', (req, res, next) => {
  const fileList = getFiles(FILES_DIR);
  res.json(fileList);
});

app.post('/upload', upload.any(), (req, res, next) => {
  res.end();
});

app.post(
  '/admin/schema',
  createProxyMiddleware({
    target: 'http://alpha:8080/admin/schema',
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Instance API server listening at http://localhost:${PORT}`);
});
