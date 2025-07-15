import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components";
import { ApiClient } from "../../API/httpService";
import songs from "../../consts/songs.json";
import diffCounter from "../../consts/diffsCounter";
import Thumbnail from "../../Components/Thumbnail";
import SongDetails from "./SongDetails";
import compareGrades from "../../helpers/compareGrades";
import { useNotification } from "../../Components/Notification";
import { formatBadge } from "../../helpers/badgeUtils";

const apiClient = new ApiClient();

const Songs = ({ mode }) => {
  const { notify } = useNotification();
  const [openChart, setOpenChart] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(() => localStorage.getItem("songSort") || "tier");
  const [details, setDetails] = useState({ item_single: {}, item_double: {}, item_coop: {} });
  const [hiddenDiffs, setHiddenDiffs] = useState(() => {
    const stored = localStorage.getItem("hiddenDiffs");
    return stored ? JSON.parse(stored) : { item_single: {}, item_double: {} };
  });
  const [hidePlayed, setHidePlayed] = useState(false);

  useEffect(() => {
    localStorage.setItem("hiddenDiffs", JSON.stringify(hiddenDiffs));
  }, [hiddenDiffs]);

  useEffect(() => {
    localStorage.setItem("songSort", sort);
  }, [sort]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      apiClient.getScores(mode).then((response) => {
        setDetails((d) => ({ ...d, [mode]: response.data }));
      });
    }
  }, [mode]);

  const displayedSongs = useMemo(() => {
    const res = {};
    Object.entries(diffCounter[mode]).forEach(([diff]) => {
      res[diff] = Object.entries(songs).filter(([key, value]) => {
        const hasDiff = value.diffs?.some((d) => d.diff === diff && d.type === mode);
        const inName = value.title.toLowerCase().includes(search.toLowerCase());
        return hasDiff && inName;
      });
    });
    return res;
  }, [search, mode]);

  const changeGrade = (chart, value) => {
    apiClient
      .postScores(mode, {
        song_id: chart.id,
        diff: chart.diff,
        grade: value,
      })
      .then((r) => {
        const { newBadges = [], newTitles = [] } = r.data || {};
        if (newBadges.length || newTitles.length) {
          const badgeNames = newBadges.map((b) => formatBadge(b));
          notify(`New achievements: ${[...badgeNames, ...newTitles].join(', ')}`, 'success');
        }
      });

    setDetails((prev) => {
      const copy = { ...prev };
      copy[mode] = copy[mode] || {};
      copy[mode][chart.diff] = copy[mode][chart.diff] || {};
      copy[mode][chart.diff][chart.id] = { grade: value };
      return copy;
    });
  };

  const shouldDisplay = (songId, diff) => {
    if (hidePlayed && details[mode][diff]?.[songId]?.grade) {
      return false;
    }
    return true;
  };

  const sortCharts = (diff) => (a, b) => {
    const adiff = a[1].diffs.find((v) => v.diff === diff && v.type === mode);
    const bdiff = b[1].diffs.find((v) => v.diff === diff && v.type === mode);
    switch (sort) {
      case 'grade':
        return compareGrades(
          details[mode][diff]?.[a[0]]?.grade,
          details[mode][diff]?.[b[0]]?.grade
        );
      case 'popularity':
        return parseInt(a[0]) - parseInt(b[0]);
      case 'tier':
      default:
        if (!adiff || !bdiff || adiff.adiff === '?' || bdiff.adiff === '?') return 0;
        return adiff.adiff.localeCompare(bdiff.adiff);
    }
  };

  return (
    <Box>
      <Modal open={Boolean(openChart)} onClose={() => setOpenChart(null)}>
        <ModalBox>
          {openChart && (
            <SongDetails chart={openChart} changeGrade={(v) => changeGrade(openChart, v)} />
          )}
        </ModalBox>
      </Modal>

      <TopBar>
        <StyledTextField
          placeholder="Search song"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl size="small">
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="tier">Tier</MenuItem>
            <MenuItem value="grade">Grade</MenuItem>
            <MenuItem value="popularity">Popular</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Checkbox checked={hidePlayed} onChange={(e) => setHidePlayed(e.target.checked)} />}
          label="Hide played"
        />
      </TopBar>

      <Card>
        {Object.entries(diffCounter[mode]).map(([diff, count]) => {
          const songsForDiff = (displayedSongs[diff] || []).filter(([id]) => shouldDisplay(id, diff));
          if (hiddenDiffs[mode]?.[diff] || songsForDiff.length === 0) return null;
          return (
            <Accordion key={diff} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {diff.replace('lv_', '')} ({
                    (details[mode][diff] &&
                      Object.values(details[mode][diff]).filter((v) => !!v.grade).length) || 0
                  }/{count})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  {songsForDiff
                    .sort(sortCharts(diff))
                    .map(([id, value]) => {
                      const chartData = {
                        id,
                        ...value,
                        mode,
                        diff,
                        ...(details[mode][diff]?.[id] || {}),
                      };
                      return (
                        <Grid item key={id}>
                          <Thumbnail data={chartData} onClick={() => setOpenChart(chartData)} />
                        </Grid>
                      );
                    })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Card>
    </Box>
  );
};

export default Songs;

const StyledTextField = styled(TextField)`
  min-width: 250px;
`;

const ModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  background: white;
  padding: 14px;
`;

const TopBar = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Card = styled(Box)`
  background-color: #fafafa;
  box-shadow: 0px 0px 35px -10px rgba(0, 0, 0, 0.15);
  padding: 10px;
`;
