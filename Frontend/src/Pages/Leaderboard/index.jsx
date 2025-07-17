import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../API/httpService';
import Section from '../../Components/Layout/Section';
import {
  Box,
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Av from '../../Assets/anon.png';

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

const SortOptions = styled(ToggleButtonGroup)`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  & .MuiToggleButton-root {
    flex: 1;
  }
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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel>Sort by</FormLabel>
          <SortOptions
            exclusive
            value={sort}
            onChange={(_, v) => v && setSort(v)}
          >
            <ToggleButton value="singles">Singles</ToggleButton>
            <ToggleButton value="doubles">Doubles</ToggleButton>
          </SortOptions>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={row.avatarUrl || Av} sx={{ width: 24, height: 24 }} />
                    <UserLink to={`/profile/${row.id}`}>{row.username}</UserLink>
                  </Box>
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
