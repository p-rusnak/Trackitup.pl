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
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components";
import { ApiClient } from "../../API/httpService";
import Thumbnail from "../../Components/Thumbnail";
import { Box } from "@mui/system";
import SongDetails from "./SongDetails";
import songs from "../../consts/songs";
import diffCounter from "../../consts/diffsCounter";
import GradeSelect from "../../Components/GradeSelect";
import compareGrades from "../../helpers/compareGrades";

const apiClient = new ApiClient();

const sortByFilters = (ar, br, diff, details, mode, sort) => {
  const a = ar[1].diffs.find((v) => v.diff === diff && v.type === mode);
  const b = br[1].diffs.find((v) => v.diff === diff && v.type === mode);
  switch (sort) {
    case "tier":
      if (a === "?") return -1;
      if (a.adiff < b.adiff) return 1;
      else if (a.adiff === b.bdiff) {
        return 0;
      } else {
        return -1;
      }
    case "grade":
      if (details[mode][diff]) {
        return compareGrades(
          details[mode][diff][ar[0]]?.grade,
          details[mode][diff][br[0]]?.grade
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
          tags[el] && a[1].diffs.find((d) => d.diff === diff).tag?.includes(el)
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
  const [openChart, setOpenChart] = useState(false);
  const [search, setSearch] = useState();
  const [data, setData] = useState({});
  const [details, setDetails] = useState({
    item_single: {},
    item_double: {},
  });
  const [sort, setSort] = useState("tier");
  const [hidden, setHidden] = useState({});
  const [tags, setTags] = useState({});
  const [hideScore, setHideScores] = useState("");

  let prevChart;

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
          !!value.title.toLowerCase().includes(search.title.toLowerCase())
      );
    }
    if (search?.p1Diff && search?.p2Diff) {
      newSongList = newSongList.filter(([key, value]) => {
        const prefix1 = search.p1Diff > 9 ? "lv_" : "lv_0";
        const prefix2 = search.p2Diff > 9 ? "lv_" : "lv_0";
        return (
          !!value.diffs?.find(
            (d) => d.type === mode && d.diff === prefix1 + search.p1Diff
          ) &&
          !!value.diffs?.find(
            (d) => d.type === mode && d.diff === prefix2 + search.p2Diff
          )
        );
      });
    }

    loadData(newSongList);
  }, [search]);

  const openPopup = (chart) => {
    setOpenChart(chart);
  };

  const changeGrade = (value) => {
    apiClient.postScores(mode, {
      songId: openChart.id,
      diff: openChart.diff,
      grade: value,
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

  const shouldDisplayDiff = (diff) => {
    const prefix1 = search?.p1Diff > 9 ? "lv_" : "lv_0";
    const prefix2 = search?.p2Diff > 9 ? "lv_" : "lv_0";
    let result = true;
    if (!data[diff]?.length) result = false;

    if (search && search.p1Diff && search.p2Diff)
      if (
        !(diff === `${prefix1}${search.p1Diff}`) &&
        !(diff === `${prefix2}${search.p2Diff}`)
      )
        result = false;

    if (
      !data[diff]?.some((item) =>
        filterItems(item, details, mode, diff, hidden, hideScore, tags)
      )
    ) {
      result = false;
    }

    return result;
  };

  return (
    <div>
      <Modal
        open={!!openChart}
        onClose={() => {
          setOpenChart(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
          <SongDetails chart={openChart} changeGrade={changeGrade} />
        </StyledBox>
      </Modal>

      <div>
        <StyledTextField
          onChange={(e) =>
            setSearch(
              e.target.value ? { ...search, title: e.target.value } : undefined
            )
          }
          value={search?.title || ""}
          label="Search by name"
        />
        <FormControl>
          <FormLabel id="radio-buttons-group-label">Sort by</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="tier"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="popularity"
              control={<Radio />}
              label="Song popularity"
            />
            <FormControlLabel value="grade" control={<Radio />} label="Grade" />
            <FormControlLabel
              value="tier"
              control={<Radio />}
              label="Tier list diff"
            />
            <FormControlLabel
              value="fav"
              control={<Radio />}
              label="Favourites"
            />
          </RadioGroup>
        </FormControl>
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
              <DiffSearch>
                With diffs:
                <NumberInput
                  label="P1"
                  type="number"
                  min="1"
                  max="28"
                  value={search?.p1Diff || ""}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                        ? { ...search, p1Diff: e.target.value }
                        : undefined
                    )
                  }
                />
                <NumberInput
                  label="P2"
                  type="number"
                  min="1"
                  max="28"
                  value={search?.p2Diff || ""}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                        ? { ...search, p2Diff: e.target.value }
                        : undefined
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
                <GradeSelect
                  value={hideScore}
                  onChange={(e) => setHideScores(e.target.value)}
                />
              </div>
            </Filters>
          </AccordionDetailsStyled>
        </Accordion>
        <br />
      </div>

      <Card>
        {Object.entries(diffCounter[mode]).map(
          ([diff, count]) =>
            shouldDisplayDiff(diff) && (
              <Accordion key={diff}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${diff}-content`}
                  id={`panel${diff}-header`}
                >
                  <Typography>
                    <DiffBall className={`${mode} ${diff}`}>{`(${
                      (details[mode][diff] &&
                        Object.values(details[mode][diff]).filter(
                          (v) => !!v.grade
                        )?.length) ||
                      0
                    }/${count}) `}</DiffBall>
                  </Typography>
                </AccordionSummary>
                <AccordionDetailsStyled>
                  {data[diff]
                    ?.filter((a) =>
                      filterItems(
                        a,
                        details,
                        mode,
                        diff,
                        hidden,
                        hideScore,
                        tags
                      )
                    )
                    .sort((a, b) =>
                      sortByFilters(a, b, diff, details, mode, sort)
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
                      };

                      const adiff = chartData.diffs.find(
                        (a) => a.diff === diff && a.type === mode
                      )?.adiff;
                      const divider = sort === "tier" && prevChart !== adiff;
                      prevChart = adiff;

                      return (
                        <React.Fragment key={`${chart[0]}-${diff}`}>
                          {divider && (
                            <DividerStyled>
                              {adiff || "Not Specified"}
                            </DividerStyled>
                          )}
                          <Thumbnail
                            data={chartData}
                            onClick={() => openPopup(chartData)}
                          />
                        </React.Fragment>
                      );
                    })}
                </AccordionDetailsStyled>
              </Accordion>
            )
        )}
      </Card>
    </div>
  );
};

export default Songs;

const StyledTextField = styled(TextField)`
  width: 100%;
  margin-top: 20px !important;
  margin-bottom: 20px !important;
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
  background: white;
  boxshadow: 24;
  padding: 14px;
`;

const Filters = styled.div`
  width: 100%;
`;
const Card = styled.div`
  background-color: #fafafa;
  box-shadow: 0px 0px 35px -10px rgba(0, 0, 0, 0.15);
`;
const DiffSearch = styled.div`
  display: flex;
  align-items: center;
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
