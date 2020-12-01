const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
const port = 3000;

const proxyToDgraph = createProxyMiddleware({ target: 'http://alpha:8080' });

app.use(morgan('combined'));

app.use('/graphql', proxyToDgraph);

app.listen(port, () => {
  console.log(`App server listening at http://localhost:${port}`);
});
