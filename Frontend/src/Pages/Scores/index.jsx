import React, { useEffect, useState } from 'react';
import Section from '../../Components/Layout/Section';
import { ApiClient } from '../../API/httpService';
import songs from '../../consts/songs.json';
import styled from 'styled-components';

const apiClient = new ApiClient();

const Scores = () => {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    apiClient.getLatestScores().then((res) => setLatest(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <Section header="Latest scores">
        <List>
          {latest.map((s) => (
            <Item key={s.id}>
              <strong>{s.user?.username}</strong> – {songs[s.song_id]?.title || s.song_id} [
              {s.mode === 'item_double' ? 'Double' : 'Single'} {s.diff}] :{' '}
              {s.grade || '-'}
            </Item>
          ))}
        </List>
      </Section>
    </>
  );
};

export default Scores;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  margin-bottom: 5px;
`;
