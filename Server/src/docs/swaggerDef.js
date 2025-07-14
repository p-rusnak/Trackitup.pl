const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Trackitup API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `https://api.trackitup.pl:${config.port}/trackitup/api/v1`,
    },
    {
      url: `http://localhost:${config.port}/trackitup/api/v1`,
    }
  ],
};

module.exports = swaggerDef;
