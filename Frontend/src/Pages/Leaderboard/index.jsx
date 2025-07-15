import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../API/httpService';
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const apiClient = new ApiClient();

const Leaderboard = () => {
  const [sort, setSort] = useState('singles');
  const [data, setData] = useState([]);

  useEffect(() => {
    apiClient.getLeaderboard().then((res) => {
      setData(res.data);
    });
  }, []);

  const sortedData = [...data].sort((a, b) => b[sort] - a[sort]);

  return (
    <Box sx={{ p: 2 }}>
      <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
        <InputLabel id="sort-select-label">Sort By</InputLabel>
        <Select labelId="sort-select-label" value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
          <MenuItem value={'singles'}>Singles</MenuItem>
          <MenuItem value={'doubles'}>Doubles</MenuItem>
        </Select>
      </FormControl>
      <Table>
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
              <TableCell>{row.username}</TableCell>
              <TableCell align="right">{row.singles ? `LV ${row.singles}` : '-'}</TableCell>
              <TableCell align="right">{row.doubles ? `LV ${row.doubles}` : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Leaderboard;
