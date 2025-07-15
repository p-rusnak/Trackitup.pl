import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Section from '../../Components/Layout/Section';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { ApiClient } from '../../API/httpService';
import songs from '../../consts/songs.json';
import compareGrades from '../../helpers/compareGrades';

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

  const parseLevel = (d) => {
    const n = parseInt(d.replace('lv_', ''));
    return Number.isNaN(n) ? 0 : n;
  };

  const diffCounts = Object.entries(scores || {})
    .map(([diff, vals]) => ({ diff, count: Object.keys(vals).length }))
    .sort((a, b) => parseLevel(a.diff) - parseLevel(b.diff));

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
            <li key={`${bp.songId}-${bp.diff}`}>{songs[bp.songId]?.title} - {bp.grade} ({bp.diff})</li>
          ))}
        </ul>
      </Section>
      <Section header="Passes by difficulty">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Difficulty</TableCell>
              <TableCell align="right">Pass count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diffCounts.map(({ diff, count }) => (
              <TableRow key={diff}>
                <TableCell>{diff}</TableCell>
                <TableCell align="right">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
};

export default Profile;
