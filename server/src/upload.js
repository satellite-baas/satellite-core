const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const { getFiles } = require('./helpers');

const app = express();

const FILES_DIR = '/media/data';

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

module.exports = app;
