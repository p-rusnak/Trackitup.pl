const pool = require('../db');

const create = async (tokenBody) => {
  const { rows } = await pool.query(
    'INSERT INTO tokens(token, user_id, type, expires, blacklisted) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [tokenBody.token, tokenBody.user, tokenBody.type, tokenBody.expires, tokenBody.blacklisted || false]
  );
  return rows[0];
};

const findOne = async (filter) => {
  const conditions = [];
  const values = [];
  if (filter.token !== undefined) {
    values.push(filter.token);
    conditions.push(`token = $${values.length}`);
  }
  if (filter.type !== undefined) {
    values.push(filter.type);
    conditions.push(`type = $${values.length}`);
  }
  if (filter.user !== undefined) {
    values.push(filter.user);
    conditions.push(`user_id = $${values.length}`);
  }
  if (filter.blacklisted !== undefined) {
    values.push(filter.blacklisted);
    conditions.push(`blacklisted = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(`SELECT * FROM tokens ${where} LIMIT 1`, values);
  return rows[0] || null;
};

const deleteMany = async (filter) => {
  const conditions = [];
  const values = [];
  if (filter.user !== undefined) {
    values.push(filter.user);
    conditions.push(`user_id = $${values.length}`);
  }
  if (filter.type !== undefined) {
    values.push(filter.type);
    conditions.push(`type = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  await pool.query(`DELETE FROM tokens ${where}`, values);
};

const countDocuments = async () => {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM tokens');
  return rows[0].count;
};

module.exports = {
  create,
  findOne,
  deleteMany,
  countDocuments,
};
