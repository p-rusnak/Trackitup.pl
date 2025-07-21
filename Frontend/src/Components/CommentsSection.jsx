import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import styled from 'styled-components';
import { ApiClient } from '../API/httpService';
import { useUser } from './User';

const CommentsSection = ({ mode, songId, diff }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const { user } = useUser();
  const api = new ApiClient();

  const load = () => {
    api.getComments(mode, songId, diff).then((r) => setComments(r.data));
  };

  useEffect(() => {
    load();
  }, [mode, songId, diff]);

  const post = () => {
    if (!text.trim()) return;
    api
      .postComment(mode, { song_id: songId, diff, text })
      .then((r) => {
        setText('');
        setComments((c) => [...c, r.data]);
      });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Comments
      </Typography>
      {comments.map((c) => (
        <CommentItem key={c.id}>
          <b>{c.user.username}:</b> {c.text}
        </CommentItem>
      ))}
      {user && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField
            size="small"
            fullWidth
            label="Add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button variant="contained" onClick={post}>
            Post
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentsSection;

const CommentItem = styled.div`
  margin-bottom: 4px;
`;
