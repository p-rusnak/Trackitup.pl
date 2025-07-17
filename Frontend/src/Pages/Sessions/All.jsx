import React, { useEffect, useState } from "react";
import Section from "../../Components/Layout/Section";
import { ApiClient } from "../../API/httpService";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Box,
} from "@mui/material";
import Av from "../../Assets/anon.png";

const api = new ApiClient();

const AllSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api
      .getAllSessions()
      .then((r) => setSessions(r.data))
      .catch(() => {});
  }, []);

  const formatDuration = (s) =>
    Math.round((new Date(s.endedAt || s.lastScore) - new Date(s.startedAt)) / 60000);

  return (
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
          {sessions.map((s) => (
            <TableRow key={s.id} component={Link} to={`/session/${s.id}`}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={s.user?.avatarUrl || Av} sx={{ width: 24, height: 24 }} />
                  <UserLink to={`/profile/${s.userId}`}>{s.user?.username}</UserLink>
                </Box>
              </TableCell>
              <TableCell>{s._count?.scores || 0}</TableCell>
              <TableCell>{formatDuration(s)}m</TableCell>
              <TableCell>{new Date(s.startedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
};

export default AllSessions;

const UserLink = styled(Link)`
  color: inherit;
  text-decoration: underline;
  font-weight: bold;
`;
