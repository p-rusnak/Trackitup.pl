const allRoles = {
  user: ['postComments', 'rateGame', 'getOwnRating', 'getCollection', 'getScores', 'postScores'],
  admin: ['postComments', 'rateGame', 'getOwnRating', 'getCollection', 'getUsers', 'manageUsers', 'addGame'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
