const express = require('express');
const multer = require('multer');
const morgan = require('morgan');

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

app.use(morgan('combined'));

app.get('/files', (req, res, next) => {
  res.send('hello from files');
});

app.post('/upload', upload.any(), (req, res, next) => {
  res.end();
});

module.exports = app;
