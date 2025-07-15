import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Section from '../../Components/Layout/Section';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { ApiClient } from '../../API/httpService';
import songs from '../../consts/songs.json';
import compareGrades from '../../helpers/compareGrades';
import grades from '../../Assets/Grades';
import styled from 'styled-components';
import getBestTitle from '../../helpers/getBestTitle';

const MODES = {
  single: 'item_single',
  double: 'item_double',
};

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
  const [scoresSingle, setScoresSingle] = useState({});
  const [scoresDouble, setScoresDouble] = useState({});
  const [bestTitle, setBestTitle] = useState(null);

  useEffect(() => {
    if (!id) return;
    apiClient.getUser(id).then((r) => {
      setUser(r.data);
      setBestTitle(getBestTitle(r.data.titles));
    });
    apiClient.getScores(MODES.single).then((r) => setScoresSingle(r.data));
    apiClient.getScores(MODES.double).then((r) => setScoresDouble(r.data));
  }, [id]);

  const bestPasses = [];
  Object.entries(scoresSingle || {}).forEach(([diff, vals]) => {
    Object.entries(vals).forEach(([songId, { grade }]) => {
      bestPasses.push({ diff, songId, grade });
    });
  });
  bestPasses.sort((a, b) => compareGrades(a.grade, b.grade));

  const parseLevel = (d) => {
    const n = parseInt(d.replace('lv_', ''));
    return Number.isNaN(n) ? 0 : n;
  };

  const buildStats = (scores) =>
    Object.entries(scores || {})
      .map(([diff, vals]) => {
        const stats = { A: 0, S: 0, SS: 0, SSS: 0, total: 0 };
        Object.values(vals).forEach(({ grade }) => {
          stats.total += 1;
          if (!grade) return;
          if (grade === 'SSS') stats.SSS += 1;
          else if (grade === 'SS') stats.SS += 1;
          else if (grade === 'S') stats.S += 1;
          else if (grade.startsWith('A')) stats.A += 1;
        });
        return { diff, ...stats };
      })
      .sort((a, b) => parseLevel(a.diff) - parseLevel(b.diff));

  const diffStatsSingle = buildStats(scoresSingle);
  const diffStatsDouble = buildStats(scoresDouble);

  return (
    <div>
      <Section header="User info">
        {user && (
          <Box>
            <Typography variant="h6">{user.username}</Typography>
            {bestTitle && (
              <Typography variant="subtitle1">Best title: {bestTitle}</Typography>
            )}
            {user.badges?.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {user.badges.map((b) => (
                  <Chip key={b} label={b} size="small" />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Section>
      <Section header="Best passes">
        <ul>
          {bestPasses.slice(0, 10).map((bp) => (
            <li key={`${bp.songId}-${bp.diff}`}>{songs[bp.songId]?.title} - <GradeImg src={grades[bp.grade]} alt={bp.grade}/> <DiffBall className={`${MODES.single} ${bp.diff}`} /></li>
          ))}
        </ul>
      </Section>
      <Section header="Passes by difficulty - Single">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Difficulty</TableCell>
              <TableCell align="right">A</TableCell>
              <TableCell align="right">S</TableCell>
              <TableCell align="right">SS</TableCell>
              <TableCell align="right">SSS</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diffStatsSingle.map(({ diff, A, S, SS, SSS, total }) => (
              <TableRow key={diff}>
                <TableCell>{diff}</TableCell>
                <TableCell align="right">{A}</TableCell>
                <TableCell align="right">{S}</TableCell>
                <TableCell align="right">{SS}</TableCell>
                <TableCell align="right">{SSS}</TableCell>
                <TableCell align="right">{total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
      <Section header="Passes by difficulty - Double">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Difficulty</TableCell>
              <TableCell align="right">A</TableCell>
              <TableCell align="right">S</TableCell>
              <TableCell align="right">SS</TableCell>
              <TableCell align="right">SSS</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diffStatsDouble.map(({ diff, A, S, SS, SSS, total }) => (
              <TableRow key={diff}>
                <TableCell>{diff}</TableCell>
                <TableCell align="right">{A}</TableCell>
                <TableCell align="right">{S}</TableCell>
                <TableCell align="right">{SS}</TableCell>
                <TableCell align="right">{SSS}</TableCell>
                <TableCell align="right">{total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </div>
  );
};

export default Profile;
