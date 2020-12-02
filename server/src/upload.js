const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/media/data');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.any(), function (req, res, next) {
  res.end();
});

module.exports = app;
