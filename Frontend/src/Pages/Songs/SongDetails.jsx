import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import styled from "styled-components";
import GradeSelect from "../../Components/GradeSelect";
import packs from "../../consts/packs";

const SongDetails = ({ chart, changeGrade }) => {
  const [grade, setGrade] = useState(chart.grade || "");

  const loggedIn = Boolean(localStorage.getItem("token"));

  return (
    <Box>
      <Header>
        <Cover src={chart.img} alt={chart.title} />
        <div>
          <Typography variant="h6">{chart.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {chart.artist}
          </Typography>
          <DiffBallMain className={`${chart.mode} ${chart.diff}`} />
        </div>
      </Header>
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Packs:
      </Typography>
      {chart.packs.map((pack) => (
        <Typography variant="body2" key={pack.id}>
          - {packs[pack.id]?.name} ({pack.pos}/{packs[pack.id]?.songs})
        </Typography>
      ))}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Other diffs:
      </Typography>
      <div>
        {chart.diffs.map((d) => (
          <DiffBall
            key={`${d.type}-${d.diff}`}
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
    </Box>
  );
};

export default SongDetails;

const Header = styled.div`
  display: flex;
  gap: 20px;
`;

const Cover = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

const DiffBallMain = styled.span`
  display: inline-block;
  width: 80px;
  height: 80px;
`;

const DiffBall = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
`;
