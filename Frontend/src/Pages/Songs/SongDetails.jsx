import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import grades from "../../Assets/Grades";

import styled from "styled-components";
import GradeSelect from "../../Components/GradeSelect";
import packs from "../../consts/packs";
import { ApiClient } from "../../API/httpService";

const SongDetails = ({ chart, changeGrade, toggleFavorite, changeDiff, history = [], removeScore }) => {
  const [grade, setGrade] = useState(chart.grade || "");
  const loggedIn = Boolean(localStorage.getItem("token"));
  const [ratings, setRatings] = useState({ harder: 0, ok: 0, easier: 0 });
  const [goal, setGoal] = useState(false);
  const apiClient = useMemo(() => new ApiClient(), []);

  useEffect(() => {
    setGrade(chart.grade || "");
    apiClient.getRating(chart.id, chart.diff).then((r) => setRatings(r.data));
    apiClient.getGoals(chart.mode).then((r) => {
      const isGoal = r.data.some(
        (g) => g.song_id === chart.id && g.diff === chart.diff
      );
      setGoal(isGoal);
    });
  }, [chart, apiClient]);

  const rateChart = (val) => {
    apiClient.postRating({ song_id: chart.id, diff: chart.diff, rating: val }).then((r) => setRatings(r.data));
  };


  const mainDiff = useMemo(
    () =>
      chart.diffs.find((d) => d.type === chart.mode && d.diff === chart.diff) ||
      {},
    [chart]
  );

  const otherDiffs = useMemo(() => {
    const diffs = chart.diffs.filter(
      (d) => !(d.type === chart.mode && d.diff === chart.diff)
    );
    diffs.sort((a, b) => {
      if (a.type > b.type) return -1;
      if (a.type < b.type) return 1;
      if (a.diff > b.diff) return 1;
      if (a.diff < b.diff) return -1;
      return 0;
    });
    return diffs;
  }, [chart]);

  return (
    <Container>
      <CoverWrapper>
        <DiffBallMain className={`${chart.mode} ${chart.diff}`} />
        <Cover src={chart.img} alt={chart.title} />
        <FavoriteButton onClick={() => toggleFavorite(chart)}>
          {chart.fav ? <StarIcon /> : <StarBorderIcon />}
        </FavoriteButton>
      </CoverWrapper>
      <Content>
        <Typography variant="h5" gutterBottom>
          {chart.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {chart.artist}
        </Typography>
        {mainDiff.stepmaker && (
          <Typography variant="body2" gutterBottom>
            Step maker: {mainDiff.stepmaker}
          </Typography>
        )}
        {chart.bpm && (
          <Typography variant="body2" gutterBottom>
            BPM: {chart.bpm}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        {loggedIn && (
          <GradeWrapper>
            <GradeSelect
              label="Set Grade"
              value={grade}
              onChange={(g) => {
                setGrade(g);
                changeGrade(g);
              }}
            />
            <Button size="small" onClick={() => {
              apiClient
                .postGoal(chart.mode, { song_id: chart.id, diff: chart.diff })
                .then(() => setGoal((g) => !g));
            }}>
              {goal ? 'Remove Goal' : 'Set Goal'}
            </Button>
          </GradeWrapper>
        )}
        <Typography variant="subtitle2" gutterBottom>
          Packs
        </Typography>
        <PackList>
          {chart.packs.map((pack) => (
            <PackItem key={pack.id}>
              {packs[pack.id]?.img && (
                <PackImg src={packs[pack.id].img} alt={packs[pack.id].name} />
              )}
              <Typography variant="body2">
                {packs[pack.id]?.name} ({pack.pos}/{packs[pack.id]?.songs})
              </Typography>
            </PackItem>
          ))}
        </PackList>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom>
          Difficulty rating {mainDiff.adiff && `(${mainDiff.adiff})`}
        </Typography>
        <RateButtons>
          <Button color="error" size="small" onClick={() => rateChart(1)}>
            Harder
          </Button>
          <Button color="warning" size="small" onClick={() => rateChart(0)}>
            It's ok
          </Button>
          <Button color="success" size="small" onClick={() => rateChart(-1)}>
            Easier
          </Button>
        </RateButtons>
        <RatingBar>
          <RatingSegment color="#e57373" width={ratings.harder} total={ratings} />
          <RatingSegment color="#ffeb3b" width={ratings.ok} total={ratings} />
          <RatingSegment color="#81c784" width={ratings.easier} total={ratings} />
        </RatingBar>
        {otherDiffs.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Other difficulties
            </Typography>
            <DiffList>
              {otherDiffs.map((d) => (
                <DiffItem key={`${d.type}-${d.diff}`}
                  onClick={() => changeDiff && changeDiff(d)}>
                  <DiffBall className={`${d.type} ${d.diff}`} />
                </DiffItem>
              ))}
            </DiffList>
          </>
        )}
        {history.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Play History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Grade</TableCell>
                      <TableCell>Date / Time</TableCell>
                      {removeScore && <TableCell />}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell>
                          {h.grade ? (
                            <>
                              <GradeIcon src={grades[h.grade]} alt={h.grade} />
                              {h.firstPass && (
                                <Chip label="New" color="success" size="small" sx={{ ml: 1 }} />
                              )}
                            </>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(h.createdAt).toLocaleString()}
                        </TableCell>
                        {removeScore && (
                          <TableCell>
                            <IconButton size="small" onClick={() => removeScore(h.id)}>
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Content>
    </Container>
  );
};

export default SongDetails;

const RatingSegment = ({ color, width, total }) => {
  const totalVotes = total.harder + total.ok + total.easier;
  const w = totalVotes ? (width / totalVotes) * 100 : 0;
  return <Segment style={{ width: `${w}%`, backgroundColor: color }} />;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CoverWrapper = styled.div`
  position: relative;
  text-align: right;
`;

const Cover = styled.img`
  height: auto;
  max-height: 300px;
`;

const Content = styled(Box)`
  padding: 16px;
`;

const PackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PackImg = styled.img`
  width: auto;
  height: 52px;
`;

const DiffList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const DiffItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const GradeWrapper = styled.div`
  margin-top: 16px;

`;

const DiffBallMain = styled.span`
  display: inline-block;
  width: 80px;
  height: 80px;
  position: absolute;
  left: 20px;
  top: 20px;

`;

const FavoriteButton = styled(IconButton)`
  position: absolute !important;
  top: 8px;
  right: 8px;
  color: gold;
`;

const DiffBall = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const RateButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
`;

const RatingBar = styled.div`
  display: flex;
  width: 100%;
  height: 8px;
  background-color: #ddd;
`;

const Segment = styled.div`
  height: 100%;
`;

const GradeIcon = styled.img`
  height: 20px;
  vertical-align: middle;
`;
