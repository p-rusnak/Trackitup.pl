const pool = require('../../src/db');

const tables = ['users', 'tokens', 'comments', 'games', 'ratings', 'scores', 'goals'];

const setupTestDB = () => {
  beforeEach(async () => {
    await Promise.all(tables.map((t) => pool.query(`DELETE FROM ${t}`).catch(() => {})));
  });
};

module.exports = setupTestDB;
