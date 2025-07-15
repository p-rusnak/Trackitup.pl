const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { missingService } = require('../services');

const createMissing = catchAsync(async (req, res) => {
  const missing = await missingService.createMissing(req.body);
  res.status(httpStatus.CREATED).send(missing);
});

module.exports = { createMissing };
