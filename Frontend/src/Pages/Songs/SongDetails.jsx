import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import GradeSelect from "../../Components/GradeSelect";
import packs from "../../consts/packs";

const SongDetails = ({ chart, changeGrade }) => {
  const [grade, setGrade] = useState(chart.grade || "");

  chart.diffs.sort((a, b) => {
    if (a.type > b.type) return -1;
    if (a.type < b.type) return 1;

    if (a.diff > b.diff) return 1;
    if (a.diff < b.diff) return -1;

    return 0;
  });


  const loggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div>
      <div>Title: {chart.title}</div>
      <div>Artist: {chart.artist}</div>
      <DiffBallMain className={`${chart.mode} ${chart.diff}`} />
      <div>Packs:</div>
      {chart.packs.map((pack) => (
        <div key={pack.id}>
          - {packs[pack.id]?.name} ({pack.pos}/{packs[pack.id]?.songs})
        </div>
      ))}

      <div>Other diffs: </div>
      <div>
        {chart.diffs.map((d) => (
          <DiffBall
            key={`${d.type} ${d.diff}`}
            className={`${d.type} ${d.diff}`}
          />
        ))}
      </div>

      {loggedIn && (
        <GradeSelect
          label="Set Grade"
          value={grade}
          onChange={(g) => {
            setGrade(g);
            changeGrade(g);
          }}
        />
      )}
      
      {/* TODO: score upload */}
    </div>
  );
};

export default SongDetails;

const DiffBallMain = styled.span`
  display: inline-block;
  width: 80px;
  height: 80px;
  position: absolute;
  right: 20px;
  top: 20px;
`;
const DiffBall = styled.span`
  display: inline-block;
  width: 50px;
  height: 50px;
`;
