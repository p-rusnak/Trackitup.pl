const pool = require('../db');

const create = async (comment) => {
  const { rows } = await pool.query(
    'INSERT INTO comments(parent_id, content, author) VALUES($1,$2,$3) RETURNING *',
    [comment.parentId, comment.content, JSON.stringify(comment.author)]
  );
  return rows[0];
};

const paginateComments = async (filter) => {
  const params = [];
  let query = 'SELECT * FROM comments';
  if (filter.parentId) {
    params.push(filter.parentId);
    query += ` WHERE parent_id = $${params.length}`;
  }
  query += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, params);
  return { results: rows };
};

module.exports = {
  create,
  paginateComments,
};
