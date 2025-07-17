import React, { useEffect, useState } from "react";
import { ApiClient } from "../../API/httpService";
import songs from "../../consts/songs.json";
import grades from "../../Assets/Grades";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../Components/User";
import styled from "styled-components";

const api = new ApiClient();

const DiffBall = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
`;

const SessionPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [view, setView] = useState("list");
  const navigate = useNavigate();
  const { user } = useUser();
  const isOwn = user && session && String(user.id) === String(session.userId);

  const load = () => {
    const req = id ? api.getSession(id) : api.getCurrentSession();
    req
      .then((r) => {
        if (r.status === 204) setSession(null);
        else setSession(r.data);
      })
      .catch(() => setSession(null));
  };

  useEffect(() => {
    load();
  }, [id]);

  const endSession = () => {
    api.endSession().then(() => load());
  };

  const cancelSession = () => {
    api.cancelSession().then(() => load());
  };

  const removeSession = () => {
    if (!id) return;
    api.deleteSession(id).then(() => {
      if (user) navigate(`/sessions/${user.id}`);
    });
  };

  if (!session)
    return <p>{id ? 'Session not found' : 'No active session'}</p>;

  return (
      <Box>
        {!id && (
          <Box sx={{ mb: 2 }}>
            <Button onClick={endSession} variant="contained" sx={{ mr: 1 }}>
              End Session
            </Button>
            <Button onClick={cancelSession} variant="outlined">
              Cancel Session
            </Button>
          </Box>
        )}
        {id && isOwn && (
          <Box sx={{ mb: 2 }}>
            <Button onClick={removeSession} variant="outlined" color="error">
              Delete Session
            </Button>
          </Box>
        )}
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="list">List</ToggleButton>
          <ToggleButton value="grid">Grid</ToggleButton>
        </ToggleButtonGroup>
        {view === "list" ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Song</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Diff</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {session.scores.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={songs[s.song_id]?.img} alt="cover" width={40} />
                      <Link to={`/song/${s.song_id}/${s.mode}/${s.diff}`}>{songs[s.song_id]?.title || s.song_id}</Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {s.grade ? <img src={grades[s.grade]} alt={s.grade} height={30}/> : "-"}
                  </TableCell>
                  <TableCell>
                    <DiffBall className={`${s.mode} ${s.diff}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {session.scores.map((s) => (
              <Paper key={s.id} sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img src={songs[s.song_id]?.img} alt="cover" width={40} />
                  <Link to={`/song/${s.song_id}/${s.mode}/${s.diff}`}>{songs[s.song_id]?.title || s.song_id}</Link>
                </Box>
                <Box sx={{ mt: 1 }}>
                  {s.grade ? <img src={grades[s.grade]} alt={s.grade} height={30}/> : "-"}
                </Box>
                <DiffBall className={`${s.mode} ${s.diff}`} />
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    );

};

export default SessionPage;
