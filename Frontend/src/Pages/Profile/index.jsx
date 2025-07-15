import React, { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ApiClient } from "../../API/httpService";
import songs from "../../consts/songs.json";
import compareGrades from "../../helpers/compareGrades";
import grades from "../../Assets/Grades";
import styled from "styled-components";
import getBestTitle from "../../helpers/getBestTitle";
import { formatBadge } from "../../helpers/badgeUtils";
import Av from "../../Assets/anon.png";

const MODES = {
  SINGLE: "item_single",
  DOUBLE: "item_double",
};

const DiffBall = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
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
  const [bestTitle, setBestTitle] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const avatarUrl = reader.result;
      setUser((u) => ({ ...u, avatarUrl }));
      apiClient.updateUser(id, { avatarUrl }).catch((err) => console.error(err));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!id) return;
    apiClient.getUser(id).then((r) => {
      setUser(r.data);
      setBestTitle(getBestTitle(r.data.titles));
    });
    apiClient.getScores(MODES.SINGLE).then((r) => setSingleScores(r.data));
    apiClient.getScores(MODES.DOUBLE).then((r) => setDoubleScores(r.data));
  }, [id]);

  const getAdiff = (songId, diff, mode) => {
    const chart = songs[songId]?.diffs.find(
      (d) => d.diff === diff && d.type === mode
    );
    const val = chart?.adiff;
    return val ? parseFloat(val) : 0;
  };

  const buildBestPasses = (scoresData, mode) => {
    const arr = [];
    Object.entries(scoresData || {}).forEach(([diff, vals]) => {
      Object.entries(vals).forEach(([songId, { grade }]) => {
        arr.push({ diff, songId, grade, adiff: getAdiff(songId, diff, mode) });
      });
    });
    arr.sort((a, b) => {
      const gradeComp = compareGrades(a.grade, b.grade);
      if (gradeComp !== 0) return gradeComp;
      return b.adiff - a.adiff;
    });
    return arr;
  };

  const bestSingles = buildBestPasses(singleScores, MODES.SINGLE);
  const bestDoubles = buildBestPasses(doubleScores, MODES.DOUBLE);

  const parseLevel = (d) => {
    const n = parseInt(d.replace("lv_", ""));
    return Number.isNaN(n) ? 0 : n;
  };

  const diffCounts = Object.entries(singleScores || {})
    .map(([diff, vals]) => ({ diff, count: Object.keys(vals).length }))
    .sort((a, b) => parseLevel(a.diff) - parseLevel(b.diff));

  const buildStats = (scores) =>
    Object.entries(scores || {})
      .map(([diff, vals]) => {
        const stats = { A: 0, S: 0, SS: 0, SSS: 0, total: 0 };
        Object.values(vals).forEach(({ grade }) => {
          stats.total += 1;
          if (!grade) return;
          if (grade === "SSS") stats.SSS += 1;
          else if (grade === "SS") stats.SS += 1;
          else if (grade === "S") stats.S += 1;
          else if (grade.startsWith("A")) stats.A += 1;
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
              <Avatar src={user.avatarUrl || Av} sx={{ width: 80, height: 80 }} />
              <AddButton onClick={() => fileInputRef.current && fileInputRef.current.click()} size="small">
                <AddIcon fontSize="small" />
              </AddButton>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
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
        </Box>
      )}
      </Section>
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
                  <TableCell>{songs[bp.songId]?.title}</TableCell>
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
                  <TableCell>{songs[bp.songId]?.title}</TableCell>
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
