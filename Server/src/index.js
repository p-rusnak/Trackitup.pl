const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const https = require('https');
const fs = require('fs');
const prisma = require('./prisma');

let server;

prisma.$connect().then(() => {
  logger.info('Connected to PostgreSQL via Prisma');
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
      ca,
    };
    server = https.createServer(credentials, app).listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  }
}).catch((err) => {
  logger.error(err);
  process.exit(1);
});

const exitHandler = () => {
  if (server) {
    server.close(async () => {
      logger.info('Server closed');
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    prisma.$disconnect().then(() => process.exit(1));
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
