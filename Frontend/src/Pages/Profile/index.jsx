import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Section from "../../Components/Layout/Section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { ApiClient } from "../../API/httpService";
import CalendarHeatmap from "../../Components/Heatmap";
import songs from "../../consts/songs.json";
import compareGrades from "../../helpers/compareGrades";
import grades from "../../Assets/Grades";
import styled from "styled-components";
import getBestTitle from "../../helpers/getBestTitle";
import { formatBadge } from "../../helpers/badgeUtils";
import Av from "../../Assets/anon.png";
import { useUser } from "../../Components/User";

const MODES = {
  SINGLE: "item_single",
  DOUBLE: "item_double",
};

const DiffBall = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
`;

const SongLink = styled(Link)`
  color: inherit;
  text-decoration: underline;
`;

const GradeImg = styled.img`
  height: 40px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const AddButton = styled(IconButton)`
  position: absolute !important;
  bottom: 0;
  right: 0;
  background-color: white !important;
  &:hover {
    background-color: white;
  }
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
  const [singleGoals, setSingleGoals] = useState([]);
  const [doubleGoals, setDoubleGoals] = useState([]);
  const [bestTitle, setBestTitle] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [rivals, setRivals] = useState([]);
  const [myRivals, setMyRivals] = useState([]);
  const [dailyCounts, setDailyCounts] = useState({});
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const { user: loggedUser, setUser: setLoggedUser } = useUser();
  const isOwnProfile = loggedUser && String(loggedUser.id) === String(id);

  const handleAvatarSubmit = () => {
    const avatarUrl = avatarUrlInput.trim();
    if (!avatarUrl) return;
    setUser((u) => ({ ...u, avatarUrl }));
    apiClient
      .updateUser(id, { avatarUrl })
      .catch((err) => console.error(err));
    if (loggedUser && String(loggedUser.id) === String(id)) {
      setLoggedUser((u) => ({ ...u, avatarUrl }));
    }
    setShowAvatarInput(false);
    setAvatarUrlInput("");
  };

  const handleAddRival = () => {
    apiClient.postRival(id).then(() => {
      apiClient.getRivals().then((r) => setMyRivals(r.data));
    });
  };

  const handleRemoveRival = (rid) => {
    apiClient.postRival(rid).then(() => {
      setMyRivals((rs) => rs.filter((r) => r.id !== rid));
    });
  };

  useEffect(() => {
    if (!id) return;
    apiClient.getUser(id).then((r) => {
      setUser(r.data);
      setBestTitle(getBestTitle(r.data.titles));
    });
    apiClient.getScores(MODES.SINGLE, id).then((r) => setSingleScores(r.data));
    apiClient.getScores(MODES.DOUBLE, id).then((r) => setDoubleScores(r.data));
    apiClient.getGoals(MODES.SINGLE, id).then((r) => setSingleGoals(r.data));
    apiClient.getGoals(MODES.DOUBLE, id).then((r) => setDoubleGoals(r.data));
    apiClient.listSessions(id).then((r) => setSessions(r.data));
    apiClient.getRivals(id).then((r) => setRivals(r.data));
      apiClient
        .getDailyScores(id)
        .then((r) => {
          const obj = {};
          r.data.forEach((d) => {
            const key = new Date(d.date).toISOString().slice(0, 10);
            obj[key] = d.count;
          });
          setDailyCounts(obj);
        })
      .catch(() => {});
    if (loggedUser) {
      apiClient.getRivals().then((r) => setMyRivals(r.data));
    }
  }, [id, loggedUser]);

  const getAdiff = (songId, diff, mode) => {
    const chart = songs[songId]?.diffs.find(
      (d) => d.diff === diff && d.type === mode
    );
    const val = chart?.adiff;
    return val ? parseFloat(val) : 0;
  };

  const parseLevel = (d) => {
    const n = parseInt(d.replace("lv_", ""));
    return Number.isNaN(n) ? 0 : n;
  };

  const buildBestPasses = (scoresData, mode) => {
    const allowedGrades = new Set(["SSS", "SS", "S", "Ap", "Bp"]);
    const arr = [];
    Object.entries(scoresData || {}).forEach(([diff, vals]) => {
      Object.entries(vals).forEach(([songId, { grade }]) => {
        if (!allowedGrades.has(grade)) return;
        arr.push({ diff, songId, grade, adiff: getAdiff(songId, diff, mode) });
      });
    });
    arr.sort((a, b) => {
      const diffComp = parseLevel(b.diff) - parseLevel(a.diff);
      if (diffComp !== 0) return diffComp;
      const gradeComp = compareGrades(a.grade, b.grade);
      if (gradeComp !== 0) return gradeComp;
      return b.adiff - a.adiff;
    });
    return arr;
  };

  const bestSingles = buildBestPasses(singleScores, MODES.SINGLE);
  const bestDoubles = buildBestPasses(doubleScores, MODES.DOUBLE);

  const diffCounts = Object.entries(singleScores || {})
    .map(([diff, vals]) => ({ diff, count: Object.keys(vals).length }))
    .sort((a, b) => parseLevel(a.diff) - parseLevel(b.diff));

  const buildStats = (scores) =>
    Object.entries(scores || {})
      .map(([diff, vals]) => {
        const stats = { A: 0, S: 0, SS: 0, SSS: 0, total: 0 };
        Object.values(vals).forEach(({ grade }) => {
          if (!grade) return;
          if (grade === "SSS") {
            stats.SSS += 1;
            stats.total += 1;
          } else if (grade === "SS") {
            stats.SS += 1;
            stats.total += 1;
          } else if (grade === "S") {
            stats.S += 1;
            stats.total += 1;
          } else if (grade === "Ap") {
            stats.A += 1;
            stats.total += 1;
          }
        });
        return { diff, ...stats };
      })
      .sort((a, b) => parseLevel(a.diff) - parseLevel(b.diff));

  const diffStatsSingle = buildStats(singleScores);
  const diffStatsDouble = buildStats(doubleScores);

  return (
    <div>
      <Section header="User info">
        {user && (
          <Box>
            <AvatarWrapper>
              <Avatar
                src={user.avatarUrl || Av}
                sx={{ width: 80, height: 80 }}
              />
              {isOwnProfile && (
                <>
                  <AddButton
                    onClick={() => setShowAvatarInput((v) => !v)}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </AddButton>
                  {showAvatarInput && (
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <TextField
                        label="Avatar URL"
                        size="small"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                      />
                      <IconButton onClick={handleAvatarSubmit} size="small">
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </>
              )}
            </AvatarWrapper>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {user.username}
            </Typography>
            {bestTitle && (
              <Typography variant="subtitle1">Title: {bestTitle}</Typography>
            )}
            {user.badges?.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {user.badges.map((b) => (
                  <Chip key={b} label={formatBadge(b)} size="small" />
                ))}
              </Box>
            )}
            <Typography sx={{ mt: 1 }}>
              <Link to="/Titles">Titles info</Link>
            </Typography>
            {!isOwnProfile && loggedUser && (
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  onClick={handleAddRival}
                  disabled={myRivals.some((r) => r.id === user.id) || myRivals.length >= 5}
                >
                  {myRivals.some((r) => r.id === user.id) ? 'Rival added' : 'Add as rival'}
                </Button>
                {myRivals.length >= 5 && !myRivals.some((r) => r.id === user.id) && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    You already selected 5 rivals
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Section>
      <Section header="Rivals">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {rivals.length === 0 ? (
            <Typography variant="body2">No rivals yet</Typography>
          ) : (
            rivals.slice(0, 5).map((r) => (
              <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={r.avatarUrl || Av} sx={{ width: 40, height: 40 }} />
                <Link to={`/profile/${r.id}`}>{r.username}</Link>
                {isOwnProfile && (
                  <IconButton size="small" onClick={() => handleRemoveRival(r.id)}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))
          )}
        </Box>
      </Section>
      {Object.keys(dailyCounts).length > 0 && (
        <Section header="Daily activity">
          <CalendarHeatmap counts={dailyCounts} />
        </Section>
      )}
      {sessions.length > 0 && (
        <Section header="Your sessions">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Start</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Scores</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id} component={Link} to={`/session/${s.id}`}>
                  <TableCell>{new Date(s.startedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {Math.round((new Date(s.endedAt || s.lastScore) - new Date(s.startedAt)) / 60000)}m
                  </TableCell>
                  <TableCell>{s._count?.scores || s.scores?.length || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ mt: 1 }}>
            <Link to={`/sessions/${id}`}>Show all sessions</Link>
          </Box>
        </Section>
      )}
      <Section header="Best passes">
        <TablesWrapper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  Singles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestSingles.slice(0, 10).map((bp) => (
                <TableRow key={`${bp.songId}-${bp.diff}`}>
                  <TableCell>
                    <SongLink to={`/song/${bp.songId}/${MODES.SINGLE}/${bp.diff}`}> 
                      {songs[bp.songId]?.title}
                    </SongLink>
                  </TableCell>
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
                <TableCell align="center" colSpan={3}>
                  Doubles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestDoubles.slice(0, 10).map((bp) => (
                <TableRow key={`${bp.songId}-${bp.diff}`}>
                  <TableCell>
                    <SongLink to={`/song/${bp.songId}/${MODES.DOUBLE}/${bp.diff}`}> 
                      {songs[bp.songId]?.title}
                    </SongLink>
                  </TableCell>
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
      {(singleGoals.length > 0 || doubleGoals.length > 0) && (
        <Section header="Goals">
          <TablesWrapper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Singles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {singleGoals.map((g) => (
                <TableRow key={`${g.song_id}-${g.diff}`}>
                  <TableCell>
                    <SongLink to={`/song/${g.song_id}/${MODES.SINGLE}/${g.diff}`}> 
                      {songs[g.song_id]?.title || g.song_id}
                    </SongLink>
                  </TableCell>
                  <TableCell>
                    <DiffBall className={`${MODES.SINGLE} ${g.diff}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Doubles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doubleGoals.map((g) => (
                <TableRow key={`${g.song_id}-${g.diff}`}>
                  <TableCell>
                    <SongLink to={`/song/${g.song_id}/${MODES.DOUBLE}/${g.diff}`}> 
                      {songs[g.song_id]?.title || g.song_id}
                    </SongLink>
                  </TableCell>
                  <TableCell>
                    <DiffBall className={`${MODES.DOUBLE} ${g.diff}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TablesWrapper>
        </Section>
      )}
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
