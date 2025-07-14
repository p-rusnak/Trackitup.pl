const pool = require('../db');

const createScore = async (scoreBody) => {
  const { rows } = await pool.query(
    'INSERT INTO scores(user_id, mode, song_id, diff, grade) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [scoreBody.userId, scoreBody.mode, scoreBody.songId, scoreBody.diff, scoreBody.grade || null]
  );
  return rows[0];
};

const findByUser = async (userId, mode) => {
  const { rows } = await pool.query(
    'SELECT * FROM scores WHERE user_id = $1 AND mode = $2',
    [userId, mode]
  );
  return rows;
};

module.exports = {
  createScore,
  findByUser,
};
