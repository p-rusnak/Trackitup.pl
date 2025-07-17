/**
 * Remove sensitive information from user object before sending it in API responses
 * @param {Object} user
 * @returns {Object}
 */
function sanitizeUser(user) {
  if (!user) {
    return user;
  }
  // Exclude password and tokens relations if present
  // eslint-disable-next-line no-unused-vars
  const { password, tokens, ...publicData } = user;
  return publicData;
}

module.exports = sanitizeUser;
