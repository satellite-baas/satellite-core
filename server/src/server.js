const proxyServer = require('./proxy');
const internalAPI = require('./internalAPI');

const proxyPort = 3000;
const uploadPort = 5000;

proxyServer.listen(proxyPort, () => {
  console.log(`Proxy server listening at http://localhost:${proxyPort}`);
});

internalAPI.listen(uploadPort, () => {
  console.log(`Upload server listening at http://localhost:${uploadPort}`);
});
