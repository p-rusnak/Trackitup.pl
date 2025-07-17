import React, { useEffect, useState } from 'react';
import Section from '../../Components/Layout/Section';
import { ApiClient } from '../../API/httpService';
import songs from '../../consts/songs.json';
import styled from 'styled-components';
import grades from '../../Assets/Grades';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

const apiClient = new ApiClient();

const AllScores = () => {
  const [scores, setScores] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 30;

  useEffect(() => {
    apiClient.getAllScores(page + 1, rowsPerPage).then((res) => {
      setScores(res.data.results);
      setTotal(res.data.totalResults);
    });
  }, [page]);

  return (
    <>
      <Section header="All scores">
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
            {scores.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <UserLink to={`/profile/${s.userId}`}>{s.user?.username}</UserLink>
                </TableCell>
                <TableCell>{songs[s.song_id]?.title || s.song_id}</TableCell>
                <TableCell>
                  <DiffBall className={`${s.mode} ${s.diff}`} />
                </TableCell>
                <TableCell>
                  {s.grade ? <GradeIcon src={grades[s.grade]} alt={s.grade} /> : '-'}
                </TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Section>
    </>
  );
};

export default AllScores;

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
