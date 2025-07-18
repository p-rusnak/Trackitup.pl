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
  TableSortLabel,
  Chip,
} from '@mui/material';
import GradeDropdown from '../../Components/GradeDropdown';
import Av from '../../Assets/anon.png';
import ScoreDetailsDialog from '../../Components/ScoreDetailsDialog';


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
  const [sort, setSort] = useState('createdAt:desc');
  const [openScore, setOpenScore] = useState(null);
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
    apiClient.getAllScores(page + 1, rowsPerPage, params, sort).then((res) => {
      setScores(res.data.results);
      setTotal(res.data.totalResults);
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const handleFilter = () => {
    setPage(0);
    fetchData();
  };

  const handleSort = (field) => {
    setPage(0);
    setSort((prev) => {
      const [currField, currDir] = prev.split(':');
      const newDir = currField === field && currDir === 'asc' ? 'desc' : 'asc';
      return `${field}:${newDir}`;
    });
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
              <TableCell>
                <TableSortLabel
                  active={sort.startsWith('userId')}
                  direction={sort.startsWith('userId') ? sort.split(':')[1] : 'asc'}
                  onClick={() => handleSort('userId')}
                >
                  User
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort.startsWith('song_id')}
                  direction={sort.startsWith('song_id') ? sort.split(':')[1] : 'asc'}
                  onClick={() => handleSort('song_id')}
                >
                  Song
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort.startsWith('diff')}
                  direction={sort.startsWith('diff') ? sort.split(':')[1] : 'asc'}
                  onClick={() => handleSort('diff')}
                >
                  Diff
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort.startsWith('grade')}
                  direction={sort.startsWith('grade') ? sort.split(':')[1] : 'asc'}
                  onClick={() => handleSort('grade')}
                >
                  Grade
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort.startsWith('createdAt')}
                  direction={sort.startsWith('createdAt') ? sort.split(':')[1] : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Date / Time
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((s) => (
              <TableRow
                key={s.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => setOpenScore(s)}
              >
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
                  {s.grade ? (
                    <>
                      <GradeIcon src={grades[s.grade]} alt={s.grade} />
                      {s.firstPass && (
                        <Chip label="New" color="success" size="small" sx={{ ml: 1 }} />
                      )}
                    </>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
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
        <ScoreDetailsDialog
          open={!!openScore}
          score={openScore}
          onClose={() => setOpenScore(null)}
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
