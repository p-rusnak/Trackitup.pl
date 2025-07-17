import React, { useEffect, useState, useRef } from "react";
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
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import { useUser } from "../../Components/User";
import styled from "styled-components";
import { storeSessionId } from "../../helpers/sessionUtils";

const api = new ApiClient();

const DiffBall = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
`;

const DiffText = styled.span`
  font-weight: bold;
  color: ${(props) => (props.$mode === "item_single" ? "red" : "green")};
  font-size: 1.3rem;
`;

const GradeImg = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  height: 40px;
`;

const SongLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 115px;
`;

const TitleSpan = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 115px;
`;

const parseLevel = (d) => {
  const n = parseInt(d.replace("lv_", ""));
  return Number.isNaN(n) ? d : n;
};

const SessionPage = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(new Set());
  const shareRef = useRef(null);
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

  useEffect(() => {
    setSelected(new Set(session?.scores.map((s) => s.id)));
  }, [session]);

  const endSession = () => {
    api.endSession().then(() => {
      storeSessionId(null);
      load();
    });
  };

  const cancelSession = () => {
    api.cancelSession().then(() => {
      storeSessionId(null);
      load();
    });
  };

  const removeSession = () => {
    if (!id) return;
    if (window.confirm("Delete this session?")) {
      api.deleteSession(id).then(() => {
        if (user) navigate(`/sessions/${user.id}`);
      });
    }
  };

  const toggleSelect = (sid) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid);
      else next.add(sid);
      return next;
    });
  };

  const share = async () => {
    if (!shareRef.current) return;
    if (!window.html2canvas) {
      await new Promise((res) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
        script.onload = res;
        document.body.appendChild(script);
      });
    }
    const canvas = await window.html2canvas(shareRef.current, {
      useCORS: true,
    });
    const url = canvas.toDataURL("image/png");
    const win = window.open("");
    if (win) {
      const img = new Image();
      img.src = url;
      win.document.body.appendChild(img);
    }
  };

  if (!session) return <p>{id ? "Session not found" : "No active session"}</p>;

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
      <Box sx={{ mb: 2 }}>
        <Button onClick={share} variant="contained" startIcon={<ShareIcon />}>
          Share
        </Button>
      </Box>
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
              <TableCell>Share</TableCell>
              <TableCell>Song</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Diff</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {session.scores.map((s) => (
              <TableRow key={s.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.has(s.id)}
                    onChange={() => toggleSelect(s.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={songs[s.song_id]?.img}
                      alt="cover"
                      width={40}
                      crossOrigin="anonymous"
                    />
                    <SongLink to={`/song/${s.song_id}/${s.mode}/${s.diff}`}>
                      {songs[s.song_id]?.title || s.song_id}
                    </SongLink>
                  </Box>
                </TableCell>
                <TableCell>
                  {s.grade ? (
                    <>
                      <img src={grades[s.grade]} alt={s.grade} height={30} />
                      {s.firstPass && (
                        <Chip
                          label="New"
                          color="success"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </>
                  ) : (
                    "-"
                  )}
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
            <Box
              key={s.id}
              sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
            >
              <Checkbox
                checked={selected.has(s.id)}
                onChange={() => toggleSelect(s.id)}
              />
              <Paper
                sx={{
                  p: 2,
                  width: 160,
                  height: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <DiffText $mode={s.mode}>{parseLevel(s.diff)}</DiffText>
                  <SongLink to={`/song/${s.song_id}/${s.mode}/${s.diff}`}>
                    {songs[s.song_id]?.title || s.song_id}
                  </SongLink>
                </Box>
                <Box sx={{ position: "relative", textAlign: "center" }}>
                  <img
                    src={songs[s.song_id]?.img}
                    alt="cover"
                    width={120}
                    crossOrigin="anonymous"
                  />
                  {s.grade && (
                    <>
                      <GradeImg src={grades[s.grade]} alt={s.grade} />
                      {s.firstPass && (
                        <Chip
                          label="New"
                          color="success"
                          size="small"
                          sx={{ position: "absolute", top: 0, left: 0 }}
                        />
                      )}
                    </>
                  )}
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      )}
      <Box
        sx={{
          position: "absolute",
          left: -9999,
          top: 0,
          p: 2,
          bgcolor: "#111",
          color: "#fff",
          "& .MuiTableCell-root": { color: "#fff" },
          width: view === "grid" ? 725 : "auto",
        }}
        ref={shareRef}
      >
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
              {session.scores
                .filter((s) => selected.has(s.id))
                .map((s) => (
                  <TableRow key={`share-${s.id}`}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <img
                          src={songs[s.song_id]?.img}
                          alt="cover"
                          width={40}
                          crossOrigin="anonymous"
                        />
                        <span>{songs[s.song_id]?.title || s.song_id}</span>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {s.grade ? (
                        <img src={grades[s.grade]} alt={s.grade} height={30} />
                      ) : (
                        "-"
                      )}
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
            {session.scores
              .filter((s) => selected.has(s.id))
              .map((s) => (
                <Paper
                  key={`share-${s.id}`}
                  sx={{
                    p: 2,
                    width: 160,
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <DiffText $mode={s.mode}>{parseLevel(s.diff)}</DiffText>
                    <TitleSpan>
                      {songs[s.song_id]?.title || s.song_id}
                    </TitleSpan>
                  </Box>
                  <Box sx={{ position: "relative", textAlign: "center" }}>
                    <img
                      src={songs[s.song_id]?.img}
                      alt="cover"
                      width={120}
                      crossOrigin="anonymous"
                    />
                    {s.grade && (
                      <GradeImg src={grades[s.grade]} alt={s.grade} />
                    )}
                  </Box>
                </Paper>
              ))}
          </Box>
        )}
        <Box sx={{ mt: 2, textAlign: "center", fontWeight: "bold" }}>
          {new Date(session.startedAt).toLocaleDateString()}
        </Box>
        <Box sx={{ textAlign: "center", fontWeight: "bold" }}>Trackitup.pl</Box>
      </Box>
    </Box>
  );
};

export default SessionPage;
