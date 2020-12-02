const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();

const API_KEY = process.env.APIKEY;

const extractTokenFromBearer = (str) => {
  const parts = str.split(' ');
  return parts.length == 2 ? parts[1] : '';
};

const checkAPIKey = (req, res, next) => {
  if (API_KEY && req.header('X-API-Key') !== API_KEY) {
    throw new Error('invalid credentials');
  }

  next();
};

const proxyToDgraph = createProxyMiddleware({
  target: `http://alpha_${process.env.SATNAME}:8080`,
  ws: true,
  onProxyReq(proxyReq, req, res) {
    const authString = req.headers.authorization;
    const token = authString ? extractTokenFromBearer(authString) : '';
    proxyReq.setHeader('X-Dgraph-AccessToken', token);
  },
});

app.use(morgan('combined'));

app.use('/graphql', checkAPIKey, proxyToDgraph);

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(401).json({
    data: {
      Message: 'Invalid credentials',
    },
  });
});

module.exports = app;
