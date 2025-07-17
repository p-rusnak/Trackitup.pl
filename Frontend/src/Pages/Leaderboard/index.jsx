import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../API/httpService';
import Section from '../../Components/Layout/Section';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const apiClient = new ApiClient();

const UserLink = styled(Link)`
  color: inherit;
  text-decoration: underline;
  font-weight: bold;
`;

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Leaderboard = () => {
  const [sort, setSort] = useState(() =>
    localStorage.getItem('leaderboardSort') || 'singles'
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    apiClient.getLeaderboard().then((res) => {
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('leaderboardSort', sort);
  }, [sort]);

  const sortedData = [...data].sort((a, b) => b[sort] - a[sort]);

  return (
    <Section header="Leaderboard">
      <Wrapper>
        <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sort}
            label="Sort By"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value={'singles'}>Singles</MenuItem>
            <MenuItem value={'doubles'}>Doubles</MenuItem>
          </Select>
        </FormControl>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="right">Singles</TableCell>
              <TableCell align="right">Doubles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <UserLink to={`/profile/${row.id}`}>{row.username}</UserLink>
                </TableCell>
                <TableCell align="right">
                  {row.singles ? `LV ${row.singles}` : '-'}
                </TableCell>
                <TableCell align="right">
                  {row.doubles ? `LV ${row.doubles}` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Wrapper>
    </Section>
  );
};

export default Leaderboard;
