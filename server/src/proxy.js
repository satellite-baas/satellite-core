const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
const API_KEY = process.env.API_KEY;

const extractTokenFromBearer = (str) => {
  const parts = str.split(' ');
  return parts.length == 2 ? parts[1] : '';
};

const checkAPIKey = (req, res, next) => {
  if (req.header('X-API-Key') !== API_KEY) {
    throw new Error('invalid credentials');
  }

  next();
};

const proxyToDgraph = (req, res, next) => {
  const authString = req.headers.authorization;
  const token = extractTokenFromBearer(authString);

  const proxy = createProxyMiddleware({
    headers: { 'X-Dgraph-AccessToken': token },
    target: 'http://alpha:8080',
  });

  proxy(req, res, next);
};

app.use(morgan('combined'));

app.use('/graphql', checkAPIKey, proxyToDgraph);

app.use(function (err, req, res, next) {
  res.status(401).json({
    data: {
      Message: 'Invalid credentials',
    },
  });
});

module.exports = app;
