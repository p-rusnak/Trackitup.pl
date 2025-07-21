const prisma = require('../db');

const createComment = async (data, mode, user) => {
  const { song_id, diff, text } = data;
  return prisma.comment.create({
    data: {
      userId: user.id,
      song_id,
      diff,
      mode,
      text,
    },
    include: { user: { select: { username: true } } },
  });
};

const getComments = async (mode, song_id, diff) =>
  prisma.comment.findMany({
    where: { mode, song_id, diff },
    orderBy: { id: 'asc' },
    include: { user: { select: { username: true } } },
  });

module.exports = { createComment, getComments };
