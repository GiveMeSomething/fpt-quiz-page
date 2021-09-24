const commonRouter = require('./common.route');

function route(app) {
  // Handle common path
  app.use('/', commonRouter);
}

module.exports = route;
