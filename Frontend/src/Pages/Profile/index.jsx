import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Section from '../../Components/Layout/Section';
import { ApiClient } from '../../API/httpService';
import songs from '../../consts/songs.json';
import compareGrades from '../../helpers/compareGrades';
import grades from '../../Assets/Grades';
import styled from 'styled-components';

const MODE = 'item_single';

const DiffBall = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
`;

const GradeImg = styled.img`
  height: 40px;
`;

const apiClient = new ApiClient();

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});

  useEffect(() => {
    if (!id) return;
    apiClient.getUser(id).then((r) => setUser(r.data));
    apiClient.getScores('item_single').then((r) => setScores(r.data));
  }, [id]);

  const bestPasses = [];
  Object.entries(scores || {}).forEach(([diff, vals]) => {
    Object.entries(vals).forEach(([songId, { grade }]) => {
      bestPasses.push({ diff, songId, grade });
    });
  });
  bestPasses.sort((a, b) => compareGrades(a.grade, b.grade));

  return (
    <div>
      <Section header="User info">
        {user && (
          <div>
            <div>Username: {user.username}</div>
            <div>Email: {user.email}</div>
            {user.titles?.length > 0 && (
              <div>Title: {user.titles[user.titles.length - 1]}</div>
            )}
            {user.badges?.length > 0 && (
              <div>Badges: {user.badges.join(', ')}</div>
            )}
          </div>
        )}
      </Section>
      <Section header="Best passes">
        <ul>
          {bestPasses.slice(0, 10).map((bp) => (
            <li key={`${bp.songId}-${bp.diff}`}>{songs[bp.songId]?.title} - <GradeImg src={grades[bp.grade]} alt={bp.grade}/> <DiffBall className={`${MODE} ${bp.diff}`} /></li>
          ))}
        </ul>
      </Section>
      <Section header="Passes by difficulty">
        {Object.entries(scores).map(([diff, vals]) => (
          <div key={diff}>
            <h4>{diff}</h4>
            <ul>
              {Object.entries(vals).map(([songId, { grade }]) => (
                <li key={`${songId}-${diff}`}>{songs[songId]?.title} - {grade}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    </div>
  );
};

export default Profile;
