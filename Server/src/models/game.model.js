const pool = require('../db');

const createGame = async (gameBody) => {
  const { rows } = await pool.query(
    `INSERT INTO games(id, name, cover_img, developer, publisher, score, platforms, description)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      gameBody.id,
      gameBody.name,
      gameBody.coverImg,
      JSON.stringify(gameBody.developer),
      JSON.stringify(gameBody.publisher),
      JSON.stringify(gameBody.score),
      JSON.stringify(gameBody.platforms),
      gameBody.description,
    ]
  );
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
  return rows[0] || null;
};

const paginateGames = async () => {
  const { rows } = await pool.query('SELECT * FROM games');
  return { results: rows };
};

module.exports = {
  createGame,
  findById,
  paginateGames,
};
