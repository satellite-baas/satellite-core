const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;

const proxyToDgraph = createProxyMiddleware({ target: 'http://alpha:8080' });

const checkAPIKey = (req, res, next) => {
  console.log(req.header('X-API-Key') === API_KEY);
  if (req.header('X-API-Key') !== API_KEY) {
    throw new Error('invalid credentials');
  }

  next();
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

app.listen(port, () => {
  console.log(`App server listening at http://localhost:${port}`);
});
