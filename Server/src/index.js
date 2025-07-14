const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const https = require('https');
const fs = require('fs');
const port = 3000;



let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  console.log(config.env)
  if (config.env === 'development') {
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } else {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.trackitup.pl/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/api.trackitup.pl/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/api.trackitup.pl/chain.pem', 'utf8');
    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };
    server = https.createServer(credentials, app).listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  }
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
