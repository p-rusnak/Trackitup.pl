import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../API/httpService';
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const apiClient = new ApiClient();

const Leaderboard = () => {
  const [mode, setMode] = useState('item_single');
  const [data, setData] = useState([]);

  useEffect(() => {
    apiClient.getLeaderboard(mode).then((res) => {
      setData(res.data);
    });
  }, [mode]);

  return (
    <Box sx={{ p: 2 }}>
      <FormControl sx={{ mb: 2, minWidth: 120 }} size="small">
        <InputLabel id="mode-select-label">Mode</InputLabel>
        <Select labelId="mode-select-label" value={mode} label="Mode" onChange={(e) => setMode(e.target.value)}>
          <MenuItem value={'item_single'}>Singles</MenuItem>
          <MenuItem value={'item_double'}>Doubles</MenuItem>
        </Select>
      </FormControl>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell align="right">Highest Pass</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.username}</TableCell>
              <TableCell align="right">{row.highest ? `LV ${row.highest}` : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Leaderboard;
