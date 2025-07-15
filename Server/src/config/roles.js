const allRoles = {
  user: ['postComments', 'getScores', 'postScores', 'postRatings'],
  admin: ['postComments', 'getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
