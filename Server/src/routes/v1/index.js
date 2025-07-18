const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const scoresRoute = require('./scores.route');
const leaderboardRoute = require('./leaderboard.route');
const missingRoute = require('./missing.route');
const ratingsRoute = require('./ratings.route');
const goalsRoute = require('./goals.route');
const sessionsRoute = require('./sessions.route');
const rivalsRoute = require('./rivals.route');
const ocrRoute = require('./ocr.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/scores',
    route: scoresRoute,
  },
  {
    path: '/leaderboard',
    route: leaderboardRoute,
  },
  {
    path: '/missings',
    route: missingRoute,
  },
  {
    path: '/ratings',
    route: ratingsRoute,
  },
  {
    path: '/goals',
    route: goalsRoute,
  },
  {
    path: '/sessions',
    route: sessionsRoute,
  },
  {
    path: '/rivals',
    route: rivalsRoute,
  },
  {
    path: `/ocr`,
    route: ocrRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
