const bcrypt = require('bcryptjs');
const pool = require('../db');

const isEmailTaken = async (email, excludeUserId) => {
  const { rows } = await pool.query(
    'SELECT 1 FROM users WHERE email = $1 AND id <> COALESCE($2, id)',
    [email, excludeUserId || null]
  );
  return rows.length > 0;
};

const isUsernameTaken = async (username, excludeUserId) => {
  const { rows } = await pool.query(
    'SELECT 1 FROM users WHERE username = $1 AND id <> COALESCE($2, id)',
    [username, excludeUserId || null]
  );
  return rows.length > 0;
};

const createUser = async (userBody) => {
  const hashed = await bcrypt.hash(userBody.password, 8);
  const { rows } = await pool.query(
    'INSERT INTO users(username, email, password, role, "isEmailVerified") VALUES($1,$2,$3,$4,$5) RETURNING *',
    [userBody.username, userBody.email, hashed, userBody.role || 'user', false]
  );
  const user = rows[0];
  delete user.password;
  return user;
};

const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
};

const findOneByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

const findOneByUsername = async (username) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0] || null;
};

const updateById = async (userId, update) => {
  const fields = [];
  const values = [];
  let idx = 1;
  Object.entries(update).forEach(([key, value]) => {
    fields.push(`${key} = $${idx}`);
    values.push(value);
    idx += 1;
  });
  values.push(userId);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const removeById = async (userId) => {
  const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
  return rows[0];
};

module.exports = {
  isEmailTaken,
  isUsernameTaken,
  createUser,
  findById,
  findOneByEmail,
  findOneByUsername,
  updateById,
  removeById,
};
