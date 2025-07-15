import React, { useEffect, useState } from 'react';
import Section from '../../Components/Layout/Section';
import { ApiClient } from '../../API/httpService';
import songs from '../../consts/songs.json';
import styled from 'styled-components';
import grades from '../../Assets/Grades';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const apiClient = new ApiClient();

const Scores = () => {
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    apiClient.getLatestScores().then((res) => setLatest(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <Section header="Latest scores">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Song</TableCell>
              <TableCell>Diff</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latest.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <UserLink to={`/profile/${s.userId}`}>{s.user?.username}</UserLink>
                </TableCell>
                <TableCell>{songs[s.song_id]?.title || s.song_id}</TableCell>
                <TableCell>
                  <DiffBall className={`${s.mode} ${s.diff}`} />
                </TableCell>
                <TableCell>
                  {s.grade ? (
                    <GradeIcon src={grades[s.grade]} alt={s.grade} />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </>
  );
};

export default Scores;


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
  text-decoration: underline;
  font-weight: bold;
`;
