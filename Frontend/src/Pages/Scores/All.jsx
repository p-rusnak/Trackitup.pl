import React, { useEffect, useState, useMemo } from 'react';
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
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  Button,
  Avatar,
  Box,
} from '@mui/material';
import GradeDropdown from '../../Components/GradeDropdown';
import Av from '../../Assets/anon.png';


const apiClient = new ApiClient();

const AllScores = () => {
  const [scores, setScores] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [player, setPlayer] = useState('');
  const [songId, setSongId] = useState('');
  const [songInput, setSongInput] = useState('');
  const [songOption, setSongOption] = useState(null);
  const [diffNumber, setDiffNumber] = useState('');
  const [diffMode, setDiffMode] = useState('');
  const [grade, setGrade] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const rowsPerPage = 30;

  const songsOptions = useMemo(
    () =>
      Object.entries(songs).map(([id, value]) => ({ id, title: value.title })),
    []
  );

  const fetchData = () => {
    const diffValue = diffNumber
      ? `lv_${diffNumber.toString().padStart(2, '0')}`
      : undefined;
    const modeValue =
      diffMode === 'S'
        ? 'item_single'
        : diffMode === 'D'
        ? 'item_double'
        : undefined;
    const params = {
      player: player || undefined,
      songId: songId || undefined,
      diff: diffValue,
      mode: modeValue,
      grade: grade || undefined,
      from: from || undefined,
      to: to || undefined,
    };
    apiClient.getAllScores(page + 1, rowsPerPage, params).then((res) => {
      setScores(res.data.results);
      setTotal(res.data.totalResults);
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleFilter = () => {
    setPage(0);
    fetchData();
  };

  return (
    <>
      <Section header="All scores">
        <Filters>
          <TextField
            label="Player"
            size="small"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
          />
          <Autocomplete
            freeSolo
            options={songsOptions}
            getOptionLabel={(o) => o.title}
            size="small"
            value={songOption}
            inputValue={songInput}
            onInputChange={(e, val) => setSongInput(val)}
            onChange={(_, val) => {
              setSongOption(val);
              setSongId(val ? val.id : '');
            }}
            renderInput={(params) => <TextField {...params} label="Song" />}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Diff"
            type="number"
            size="small"
            value={diffNumber}
            onChange={(e) => setDiffNumber(e.target.value)}
            sx={{ width: 80 }}
          />
          <Select
            value={diffMode}
            displayEmpty
            size="small"
            onChange={(e) => setDiffMode(e.target.value)}
          >
            <MenuItem value="">
              <em>-</em>
            </MenuItem>
            <MenuItem value="S">S</MenuItem>
            <MenuItem value="D">D</MenuItem>
          </Select>
          <GradeDropdown
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <TextField
            label="From"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Button variant="contained" onClick={handleFilter}>
            Apply
          </Button>
        </Filters>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={s.user?.avatarUrl || Av} sx={{ width: 24, height: 24 }} />
                    <UserLink to={`/profile/${s.userId}`}>{s.user?.username}</UserLink>
                  </Box>
                </TableCell>
                <TableCell>
                  <SongLink to={`/song/${s.song_id}/${s.mode}/${s.diff}`}> 
                    {songs[s.song_id]?.title || s.song_id}
                  </SongLink>
                </TableCell>
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

const SongLink = styled(Link)`
  color: inherit;
  text-decoration: underline;
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;
