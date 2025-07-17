import React, { useEffect, useState } from "react";
import Section from "../../Components/Layout/Section";
import { ApiClient } from "../../API/httpService";
import songs from "../../consts/songs.json";
import styled from "styled-components";
import grades from "../../Assets/Grades";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import Av from "../../Assets/anon.png";

const apiClient = new ApiClient();

const Scores = () => {
  const [latest, setLatest] = useState([]);
  const [latestPlayers, setLatestPlayers] = useState([]);
  const [ongoingSessions, setOngoingSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .getLatestScores()
      .then((res) => setLatest(res.data))
      .catch(() => {});
    apiClient
      .getLatestPlayers()
      .then((res) => setLatestPlayers(res.data))
      .catch(() => {});
    apiClient
      .getOngoingSessions()
      .then((res) => setOngoingSessions(res.data))
      .catch(() => {});
    apiClient
      .getAllSessions()
      .then((res) => setAllSessions(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      {ongoingSessions.length > 0 && (
        <Section header="Current sessions">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Play count</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Start</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ongoingSessions.map((s) => (
                <TableRow
                  key={s.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/sessions/${s.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={s.user?.avatarUrl || Av}
                        sx={{ width: 24, height: 24 }}
                      />
                      <UserLink
                        to={`/profile/${s.userId}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.user?.username}
                      </UserLink>
                    </Box>
                  </TableCell>
                  <TableCell>{s._count?.scores || 0}</TableCell>
                  <TableCell>
                    {Math.round(
                      (new Date(s.endedAt || s.lastScore) -
                        new Date(s.startedAt)) /
                        60000
                    )}
                    m
                  </TableCell>
                  <TableCell>
                    {new Date(s.startedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}
      <Section header="Latest scores">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Song</TableCell>
              <TableCell>Diff</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Date / Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latest.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={s.user?.avatarUrl || Av}
                      sx={{ width: 24, height: 24 }}
                    />
                    <UserLink to={`/profile/${s.userId}`}>
                      {s.user?.username}
                    </UserLink>
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
                    "-"
                  )}
                </TableCell>
                <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p>
          <Link to="/ScoresAll">See all scores</Link>
        </p>
      </Section>
      {allSessions.length > 0 && (
        <Section header="All sessions">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Play count</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Start</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allSessions.map((s) => (
                <TableRow
                  key={s.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/sessions/${s.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={s.user?.avatarUrl || Av}
                        sx={{ width: 24, height: 24 }}
                      />
                      <UserLink
                        to={`/profile/${s.userId}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.user?.username}
                      </UserLink>
                    </Box>
                  </TableCell>
                  <TableCell>{s._count?.scores || 0}</TableCell>
                  <TableCell>
                    {Math.round(
                      (new Date(s.endedAt || s.lastScore) -
                        new Date(s.startedAt)) /
                        60000
                    )}
                    m
                  </TableCell>
                  <TableCell>
                    {new Date(s.startedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}

      <Section header="Latest players">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Date / Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestPlayers.map((p) => (
              <TableRow key={p.userId}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={p.user?.avatarUrl || Av}
                      sx={{ width: 24, height: 24 }}
                    />
                    <UserLink to={`/profile/${p.userId}`}>
                      {p.user?.username}
                    </UserLink>
                  </Box>
                </TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
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

const SongLink = styled(Link)`
  color: inherit;
  text-decoration: underline;
`;
