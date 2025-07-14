const pool = require('../db');

const findOne = async (gameId, userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM ratings WHERE game_id = $1 AND user_id = $2',
    [gameId, userId]
  );
  return rows[0] || null;
};

const upsertRating = async (gameId, userId, ratingBody) => {
  const { rows } = await pool.query(
    `INSERT INTO ratings(game_id, user_id, rating, description, own_status, played_status)
     VALUES($1,$2,$3,$4,$5,$6)
     ON CONFLICT (game_id, user_id)
     DO UPDATE SET rating = EXCLUDED.rating, description = EXCLUDED.description,
       own_status = EXCLUDED.own_status, played_status = EXCLUDED.played_status
     RETURNING *`,
    [
      gameId,
      userId,
      ratingBody.rating || null,
      ratingBody.description || null,
      ratingBody.ownStatus || null,
      ratingBody.playedStatus || null,
    ]
  );
  return rows[0];
};

module.exports = {
  findOne,
  upsertRating,
};
