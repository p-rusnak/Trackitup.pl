import React, { useEffect, useState } from 'react';
import Section from '../../Components/Layout/Section';
import { ApiClient } from '../../API/httpService';
import songs from '../../consts/songs.json';
import styled from 'styled-components';
import grades from '../../Assets/Grades';
import { Link } from 'react-router-dom';

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
              <UserLink to={`/profile/${s.userId}`}>{s.user?.username}</UserLink> –{' '}
              {songs[s.song_id]?.title || s.song_id} <DiffBall className={`${s.mode} ${s.diff}`} /> :{' '}
              {s.grade ? (
                <GradeIcon src={grades[s.grade]} alt={s.grade} />
              ) : (
                '-'
              )}
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

const GradeIcon = styled.img`
  height: 20px;
  vertical-align: middle;
`;

const DiffBall = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
`;

const UserLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  font-weight: bold;
`;
