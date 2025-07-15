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
  SINGLE: 'item_single',
  DOUBLE: 'item_double',
};

const DiffBall = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
`;

const GradeImg = styled.img`
  height: 40px;
`;

const TablesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const apiClient = new ApiClient();

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [singleScores, setSingleScores] = useState({});
  const [doubleScores, setDoubleScores] = useState({});
  const [bestTitle, setBestTitle] = useState(null);

  useEffect(() => {
    if (!id) return;
    apiClient.getUser(id).then((r) => {
      setUser(r.data);
      setBestTitle(getBestTitle(r.data.titles));
    });
    apiClient.getScores(MODES.SINGLE).then((r) => setSingleScores(r.data));
    apiClient.getScores(MODES.DOUBLE).then((r) => setDoubleScores(r.data));
  }, [id]);

  const getAdiff = (songId, diff, mode) => {
    const chart = songs[songId]?.diffs.find(
      (d) => d.diff === diff && d.type === mode
    );
    const val = chart?.adiff;
    return val ? parseFloat(val) : 0;
  };

  const buildBestPasses = (scoresData, mode) => {
    const arr = [];
    Object.entries(scoresData || {}).forEach(([diff, vals]) => {
      Object.entries(vals).forEach(([songId, { grade }]) => {
        arr.push({ diff, songId, grade, adiff: getAdiff(songId, diff, mode) });
      });
    });
    arr.sort((a, b) => {
      const gradeComp = compareGrades(a.grade, b.grade);
      if (gradeComp !== 0) return gradeComp;
      return b.adiff - a.adiff;
    });
    return arr;
  };

  const bestSingles = buildBestPasses(singleScores, MODES.SINGLE);
  const bestDoubles = buildBestPasses(doubleScores, MODES.DOUBLE);

  const parseLevel = (d) => {
    const n = parseInt(d.replace('lv_', ''));
    return Number.isNaN(n) ? 0 : n;
  };

  const diffCounts = Object.entries(singleScores || {})
    .map(([diff, vals]) => ({ diff, count: Object.keys(vals).length }))
    .sort((a, b) => parseLevel(a.diff) - parseLevel(b.diff));

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
        <TablesWrapper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>Singles</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Song</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Diff</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestSingles.slice(0, 10).map((bp) => (
                <TableRow key={`${bp.songId}-${bp.diff}`}>
                  <TableCell>{songs[bp.songId]?.title}</TableCell>
                  <TableCell>
                    <GradeImg src={grades[bp.grade]} alt={bp.grade} />
                  </TableCell>
                  <TableCell>
                    <DiffBall className={`${MODES.SINGLE} ${bp.diff}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>Doubles</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Song</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Diff</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestDoubles.slice(0, 10).map((bp) => (
                <TableRow key={`${bp.songId}-${bp.diff}`}>
                  <TableCell>{songs[bp.songId]?.title}</TableCell>
                  <TableCell>
                    <GradeImg src={grades[bp.grade]} alt={bp.grade} />
                  </TableCell>
                  <TableCell>
                    <DiffBall className={`${MODES.DOUBLE} ${bp.diff}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TablesWrapper>
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
