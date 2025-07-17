import React, { useEffect, useState } from "react";
import { ApiClient } from "../../API/httpService";
import songs from "../../consts/songs.json";
import grades from "../../Assets/Grades";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
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
                {s.grade ? <img src={grades[s.grade]} alt={s.grade} height={30} /> : "-"}
              </TableCell>
              <TableCell>
                <DiffBall className={`${s.mode} ${s.diff}`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SessionPage;
