import React, { useEffect, useState } from "react";
import { ApiClient } from "../../API/httpService";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import Section from "../../Components/Layout/Section";

const api = new ApiClient();

const SessionsPage = () => {
  const { userId } = useParams();
  const [sessions, setSessions] = useState([]);

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
    </Section>
  );
};

export default SessionsPage;

