import React, { useEffect, useState } from "react";
import { ApiClient } from "../../API/httpService";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import Section from "../../Components/Layout/Section";

const api = new ApiClient();

const SessionsPage = () => {
  const { userId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [view, setView] = useState("list");

  useEffect(() => {
    api
      .listSessions(userId)
      .then((r) => setSessions(r.data))
      .catch(() => {});
  }, [userId]);

  const formatDuration = (s) =>
    Math.round((new Date(s.endedAt || s.lastScore) - new Date(s.startedAt)) / 60000);

  return (
    <Section header="Sessions">
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
              <TableCell>Start</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Scores</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.id} component={Link} to={`/session/${s.id}`}>
                <TableCell>{new Date(s.startedAt).toLocaleString()}</TableCell>
                <TableCell>{formatDuration(s)}m</TableCell>
                <TableCell>{s._count?.scores || s.scores?.length || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {sessions.map((s) => (
            <Paper
              key={s.id}
              component={Link}
              to={`/session/${s.id}`}
              sx={{ p: 2, textDecoration: "none" }}
            >
              <div>{new Date(s.startedAt).toLocaleString()}</div>
              <div>{formatDuration(s)}m</div>
              <div>{s._count?.scores || s.scores?.length || 0} scores</div>
            </Paper>
          ))}
        </Box>
      )}
    </Section>
  );
};

export default SessionsPage;

