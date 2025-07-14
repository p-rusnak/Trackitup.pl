function sanitize(obj) {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        const value = obj[key];
        if (typeof value === 'object') {
          sanitize(value);
        }
      }
    });
  }
}

module.exports = () => (req, res, next) => {
  ['body', 'params', 'query'].forEach((prop) => {
    if (req[prop]) {
      sanitize(req[prop]);
    }
  });
  next();
};
