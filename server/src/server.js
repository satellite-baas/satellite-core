const proxyServer = require('./proxy');

const proxyPort = 3000;

proxyServer.listen(proxyPort, () => {
  console.log(`Proxy server listening at http://localhost:${proxyPort}`);
});
