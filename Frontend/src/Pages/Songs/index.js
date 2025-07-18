import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import styled from "styled-components";
import { ApiClient } from "../../API/httpService";
import Thumbnail from "../../Components/Thumbnail";
import { Box } from "@mui/system";
import SongDetails from "./SongDetails";
import songs from "../../consts/songs";
import diffCounter from "../../consts/diffsCounter";
import GradeSelect from "../../Components/GradeSelect";
import GradeDropdown from "../../Components/GradeDropdown";
import compareGrades from "../../helpers/compareGrades";
import { useNotification } from "../../Components/Notification";
import { formatBadge } from "../../helpers/badgeUtils";
import { storeSessionId } from "../../helpers/sessionUtils";

const apiClient = new ApiClient();

const sortByFilters = (ar, br, diff, details, mode, sort) => {
  const a = ar[1].diffs.find((v) => v.diff === diff && v.type === mode);
  const b = br[1].diffs.find((v) => v.diff === diff && v.type === mode);
  const getAdiffValue = (d) => {
    if (!d) return -Infinity;
    const val = parseFloat(d.adiff);
    return Number.isNaN(val) ? -Infinity : val;
  };

  switch (sort) {
    case "tier": {
      const aVal = getAdiffValue(a);
      const bVal = getAdiffValue(b);
      if (aVal === bVal) return 0;
      return aVal > bVal ? -1 : 1;
    }
    case "grade":
      if (details[mode][diff]) {
        return compareGrades(
          details[mode][diff][ar[0]]?.grade,
          details[mode][diff][br[0]]?.grade,
        );
      } else {
        return -1;
      }
    case "fav":
      if (!!a.fav && !!b.fav) return 0;
      if (!!a.fav) return 1;
      if (!!b.fav) return -1;
      break;
    case "popularity":
      if (parseInt(ar[0]) > parseInt(br[0])) {
        return 1;
      } else {
        return -1;
      }
    default:
      break;
  }
};

const filterItems = (a, details, mode, diff, hidden, hideScore, tags) => {
  let show = true;

  if (Object.values(tags).some((d) => d)) {
    show = false;
    if (
      Object.keys(tags).some(
        (el) =>
          tags[el] && a[1].diffs.find((d) => d.diff === diff).tag?.includes(el),
      )
    ) {
      show = true;
    }
  }

  const grade =
    (details[mode][diff] && details[mode][diff][a[0]]?.grade) || undefined;
  if (hidden.pass) {
    if (grade) show = false;
    if (["A", "B", "C", "D", "F", undefined].includes(grade)) show = true;
  }
  if (hidden.played) {
    if (grade) show = false;
  }
  if (hidden.notPlayed) {
    if (!grade) show = false;
  }
  if (hidden.score) {
    if (compareGrades(grade, hideScore) < 1) show = false;
  }

  return show;
};

const Songs = ({ mode }) => {
  const { notify } = useNotification();
  const [openChart, setOpenChart] = useState(false);
  const [history, setHistory] = useState([]);
  const [rivalScores, setRivalScores] = useState([]);
  const [search, setSearch] = useState();
  const [data, setData] = useState({});
  const [details, setDetails] = useState({
    item_single: {},
    item_double: {},
    item_coop: {},
  });
  const [sort, setSort] = useState(
    () => localStorage.getItem("songSort") || "tier",
  );
  const [hidden, setHidden] = useState({});
  const [tags, setTags] = useState({});
  const [hideScore, setHideScores] = useState("");
  const [hiddenDiffs, setHiddenDiffs] = useState(() => {
    const stored = localStorage.getItem("hiddenDiffs");
    return stored ? JSON.parse(stored) : { item_single: {}, item_double: {} };
  });

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : {};
  });
  const [expandedDiffs, setExpandedDiffs] = useState({});

  useEffect(() => {
    localStorage.setItem("hiddenDiffs", JSON.stringify(hiddenDiffs));
  }, [hiddenDiffs]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("songSort", sort);
  }, [sort]);

  useEffect(() => {
    if (search?.title && search.title.length > 5) {
      const newExpanded = {};
      Object.keys(diffCounter[mode]).forEach((d) => {
        newExpanded[d] = true;
      });
      setExpandedDiffs(newExpanded);
    } else if (!search?.title) {
      setExpandedDiffs({});
    }
  }, [search?.title, mode]);

  const maxDiff = Math.max(
    ...Object.keys(diffCounter[mode]).map((d) =>
      parseInt(d.replace("lv_", "")),
    ),
  );

  let prevCategory;

  const loadData = (songData) => {
    const newData = {};
    const sd = songData instanceof Array ? songData : Object.entries(songData);
    Object.entries(diffCounter[mode]).forEach(([diff]) => {
      newData[diff] = sd.filter(([key, value]) => {
        return !!value.diffs?.find((d) => d.diff === diff && d.type === mode);
      });
    });
    setData(newData);
  };

  useEffect(() => {
    loadData(songs);
  }, []);

  useEffect(() => {
    setSearch(undefined);

    if (localStorage.getItem("token")) {
      apiClient.getScores(mode).then((response) => {
        setDetails({ ...details, [mode]: response.data });
      });
    }

    loadData(songs, true);
  }, [mode]);

  useEffect(() => {
    let newSongList = Object.entries(songs);
    if (search?.title) {
      newSongList = newSongList.filter(
        ([key, value]) =>
          !!value.title.toLowerCase().includes(search.title.toLowerCase()),
      );
    }
    if (search?.p1Diff && search?.p2Diff) {
      newSongList = newSongList.filter(([key, value]) => {
        const prefix1 = search.p1Diff > 9 ? "lv_" : "lv_0";
        const prefix2 = search.p2Diff > 9 ? "lv_" : "lv_0";
        return (
          !!value.diffs?.find(
            (d) => d.type === mode && d.diff === prefix1 + search.p1Diff,
          ) &&
          !!value.diffs?.find(
            (d) => d.type === mode && d.diff === prefix2 + search.p2Diff,
          )
        );
      });
    }

    loadData(newSongList);
  }, [search]);

  const openPopup = (chart) => {
    setOpenChart(chart);
    if (localStorage.getItem("token")) {
      apiClient
        .getScoreHistory(chart.mode, chart.id, chart.diff)
        .then((r) => setHistory(r.data));
      apiClient
        .getRivalScores(chart.mode, chart.id, chart.diff)
        .then((r) => setRivalScores(r.data));
    } else {
      setHistory([]);
      setRivalScores([]);
    }
  };

  const changeGrade = (value, skipPost = false) => {
    const post = skipPost
      ? Promise.resolve({ data: {} })
      : apiClient.postScores(mode, {
          song_id: openChart.id,
          diff: openChart.diff,
          grade: value,
        });
    post.then((r) => {
        const { newBadges = [], newTitles = [], isNew, session } = r.data || {};
        if (session) storeSessionId(session.id);
        if (isNew) {
          notify("New pass!", "success");
        }
        if (newBadges.length || newTitles.length) {
          const badgeNames = newBadges.map((b) => formatBadge(b));
          notify(
            `New achievements: ${[...badgeNames, ...newTitles].join(", ")}`,
            "success",
          );
        }
      });

    if (details[mode][openChart.diff]) {
      if (details[mode][openChart.diff][openChart.id]) {
        details[mode][openChart.diff][openChart.id].grade = value;
      } else {
        details[mode][openChart.diff][openChart.id] = { grade: value };
      }
    } else {
      details[mode][openChart.diff] = { [openChart.id]: { grade: value } };
    }
  };

  const toggleFavorite = (chart) => {
    const key = `${chart.id}-${chart.diff}-${chart.mode}`;
    setFavorites((prev) => {
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = true;
      }
      return updated;
    });
    if (
      openChart &&
      openChart.id === chart.id &&
      openChart.diff === chart.diff &&
      openChart.mode === chart.mode
    ) {
      setOpenChart({ ...openChart, fav: !favorites[key] });
    }
  };

  const changeDiff = (d) => {
    if (!openChart) return;
    const { id } = openChart;
    const grade = details[d.type]?.[d.diff]?.[id]?.grade || "";
    setOpenChart({
      ...openChart,
      diff: d.diff,
      mode: d.type,
      grade,
      fav: favorites[`${id}-${d.diff}-${d.type}`],
    });
  };

  const shouldDisplayDiff = (diff) => {
    const prefix1 = search?.p1Diff > 9 ? "lv_" : "lv_0";
    const prefix2 = search?.p2Diff > 9 ? "lv_" : "lv_0";
    let result = true;
    if (hiddenDiffs[mode]?.[diff]) result = false;
    if (!data[diff]?.length) result = false;

    if (search && search.p1Diff && search.p2Diff)
      if (
        !(diff === `${prefix1}${search.p1Diff}`) &&
        !(diff === `${prefix2}${search.p2Diff}`)
      )
        result = false;

    if (
      !data[diff]?.some((item) =>
        filterItems(item, details, mode, diff, hidden, hideScore, tags),
      )
    ) {
      result = false;
    }

    return result;
  };

  return (
    <Container maxWidth="lg">
      <Modal
        open={!!openChart}
        onClose={() => {
          setOpenChart(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <SongDetails
            chart={openChart}
            changeGrade={changeGrade}
            toggleFavorite={toggleFavorite}
            changeDiff={changeDiff}
            history={history}
            rivalScores={rivalScores}
          />
        </StyledBox>
      </Modal>

      <FilterCard>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <StyledTextField
              onChange={(e) =>
                setSearch(
                  e.target.value
                    ? { ...search, title: e.target.value }
                    : undefined,
                )
              }
              value={search?.title || ""}
              label="Search by name"
              InputProps={{
                endAdornment: search?.title ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={() => setSearch(undefined)}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel id="radio-buttons-group-label">Sort by</FormLabel>
              <SortOptions
                exclusive
                value={sort}
                onChange={(_, v) => v && setSort(v)}
              >
                <ToggleButton value="popularity">Popular</ToggleButton>
                <ToggleButton value="grade">Grade</ToggleButton>
                <ToggleButton value="tier">Tier list</ToggleButton>
              </SortOptions>
            </FormControl>
          </Grid>
        </Grid>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`search-content`}
            id={`search-header`}
          >
            <Typography>More Filters</Typography>
          </AccordionSummary>
          <AccordionDetailsStyled>
            <Filters>
              {mode === "item_single" && (
                <DiffSearch>
                  With diffs:
                  <NumberInput
                    label="P1"
                    type="number"
                    min="1"
                    max={maxDiff}
                    value={search?.p1Diff || ""}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                          ? { ...search, p1Diff: e.target.value }
                          : undefined,
                      )
                    }
                  />
                  <NumberInput
                    label="P2"
                    type="number"
                    min="1"
                    max={maxDiff}
                    value={search?.p2Diff || ""}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                          ? { ...search, p2Diff: e.target.value }
                          : undefined,
                      )
                    }
                  />
                  <Button
                    onClick={() =>
                      setSearch({
                        ...search,
                        p1Diff: undefined,
                        p2Diff: undefined,
                      })
                    }
                  >
                    Clear
                  </Button>
                </DiffSearch>
              )}
              <div>
                Tags:
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => setTags({ ...tags, side: b })}
                      value={tags.side}
                    />
                  }
                  label="Side"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => setTags({ ...tags, twist: b })}
                      value={tags.twist}
                    />
                  }
                  label="Twist"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => setTags({ ...tags, drill: b })}
                      value={tags.drill}
                    />
                  }
                  label="Drill"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => setTags({ ...tags, gimmick: b })}
                      value={tags.gimmick}
                    />
                  }
                  label="Gimmick"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => setTags({ ...tags, bracket: b })}
                      value={tags.bracket}
                    />
                  }
                  label="Bracket"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => setTags({ ...tags, "jack/jump": b })}
                      value={tags["jack/jump"]}
                    />
                  }
                  label="Jacks/Jumps"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => setTags({ ...tags, half: b })}
                      value={tags.half}
                    />
                  }
                  label="Half"
                />
              </div>
              <div>
                Hide:
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => {
                        setHidden({ ...hidden, pass: b });
                      }}
                      value={hidden.pass}
                    />
                  }
                  label="Pass"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => {
                        setHidden({ ...hidden, played: b });
                      }}
                      value={hidden.played}
                    />
                  }
                  label="Played"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => {
                        setHidden({ ...hidden, notPlayed: b });
                      }}
                      value={hidden.notPlayed}
                    />
                  }
                  label="Not Played"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(_, b) => {
                        setHidden({ ...hidden, score: b });
                      }}
                      value={hidden.score}
                    />
                  }
                  label="Score better than"
                />
                <GradeDropdown
                  value={hideScore}
                  onChange={(e) => setHideScores(e.target.value)}
                />
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="hide-diffs-content"
                    id="hide-diffs-header"
                  >
                    <Typography>Hide diffs</Typography>
                  </AccordionSummary>
                  <AccordionDetailsStyled>
                    {Object.keys(diffCounter[mode]).map((d) => (
                      <FormControlLabel
                        key={d}
                        control={
                          <Checkbox
                            checked={hiddenDiffs[mode]?.[d] || false}
                            onChange={(_, b) =>
                              setHiddenDiffs({
                                ...hiddenDiffs,
                                [mode]: { ...hiddenDiffs[mode], [d]: b },
                              })
                            }
                          />
                        }
                        label={d.replace("lv_", "")}
                      />
                    ))}
                  </AccordionDetailsStyled>
                </Accordion>
              </div>
            </Filters>
          </AccordionDetailsStyled>
        </Accordion>
        <br />
      </FilterCard>

      <Card>
        {Object.entries(diffCounter[mode]).map(([diff, count]) => {
          prevCategory = undefined;
          return (
            shouldDisplayDiff(diff) && (
              <Accordion
                key={diff}
                expanded={expandedDiffs[diff] || false}
                onChange={(_, exp) =>
                  setExpandedDiffs({ ...expandedDiffs, [diff]: exp })
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${diff}-content`}
                  id={`panel${diff}-header`}
                >
                  <Typography>
                    <DiffBall className={`${mode} ${diff}`}>{`(${
                      (details[mode][diff] &&
                        Object.values(details[mode][diff]).filter(
                          (v) => !!v.grade,
                        )?.length) ||
                      0
                    }/${count}) `}</DiffBall>
                  </Typography>
                </AccordionSummary>
                <AccordionDetailsStyled>
                  {(data[diff] || [])
                    .filter((a) =>
                      filterItems(
                        a,
                        details,
                        mode,
                        diff,
                        hidden,
                        hideScore,
                        tags,
                      ),
                    )
                    .sort((a, b) =>
                      sortByFilters(a, b, diff, details, mode, sort),
                    )
                    .map((chart) => {
                      const chartData = {
                        id: chart[0],
                        ...chart[1],
                        mode,
                        diff,
                        ...(details[mode][diff]
                          ? details[mode][diff][chart[0]]
                          : {}),
                        fav: favorites[`${chart[0]}-${diff}-${mode}`],
                      };

                      const adiff = chartData.diffs.find(
                        (a) => a.diff === diff && a.type === mode,
                      )?.adiff;
                      const grade = chartData.grade;
                      let divider = false;
                      let dividerLabel = "";
                      if (sort === "tier") {
                        divider = prevCategory !== adiff;
                        dividerLabel = adiff || "Not Specified";
                        prevCategory = adiff;
                      } else if (sort === "grade") {
                        divider = prevCategory !== grade;
                        dividerLabel = grade || "No Grade";
                        prevCategory = grade;
                      }

                      return (
                        <React.Fragment key={`${chart[0]}-${diff}`}>
                          {divider && (
                            <DividerStyled>{dividerLabel}</DividerStyled>
                          )}
                          <Thumbnail
                            data={chartData}
                            onClick={() => openPopup(chartData)}
                            onToggleFavorite={() => toggleFavorite(chartData)}
                          />
                        </React.Fragment>
                      );
                    })}
                </AccordionDetailsStyled>
              </Accordion>
            )
          );
        })}
      </Card>
    </Container>
  );
};

export default Songs;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
  @media only screen and (max-width: 600px) {
    position: sticky;
    top: 20px;
    z-index: 10;
  }
`;

const NumberInput = styled(TextField)`
  width: 70px;
`;
const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  boxshadow: 24;
  padding: 14px;
`;

const Filters = styled.div`
  width: 100%;
`;
const FilterCard = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;
const Card = styled(Paper)`
  padding: 20px;
  background-color: ${({ theme }) =>
    theme.palette?.background.paper || "white"};
`;
const DiffSearch = styled.div`
  display: flex;
  align-items: center;
`;

const SortOptions = styled(ToggleButtonGroup)`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  & .MuiToggleButton-root {
    flex: 1;
  }
`;

const AccordionDetailsStyled = styled(AccordionDetails)`
  display: flex;
  flex-wrap: wrap;
`;
const DividerStyled = styled(Divider)`
  width: 100%;
`;

const DiffBall = styled.span`
  display: inline-block;
  height: 40px;
  width: 40px;
  padding-left: 40px;
  line-height: 40px;
`;
