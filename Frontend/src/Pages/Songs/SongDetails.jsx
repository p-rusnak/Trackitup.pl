import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Divider,
} from "@mui/material";
import styled from "styled-components";
import GradeSelect from "../../Components/GradeSelect";
import packs from "../../consts/packs";

const SongDetails = ({ chart, changeGrade }) => {
  const [grade, setGrade] = useState(chart.grade || "");
  const loggedIn = Boolean(localStorage.getItem("token"));

  const mainDiff = useMemo(
    () =>
      chart.diffs.find(
        (d) => d.type === chart.mode && d.diff === chart.diff
      ) || {},
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
        <Cover src={chart.img} alt={chart.title} />
        <DiffBallMain className={`${chart.mode} ${chart.diff}`} />
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
        {otherDiffs.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Other difficulties
            </Typography>
            <DiffList>
              {otherDiffs.map((d) => (
                <DiffItem key={`${d.type}-${d.diff}`}>
                  <DiffBall className={`${d.type} ${d.diff}`} />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {d.diff.replace("lv_", "")}
                  </Typography>
                </DiffItem>
              ))}
            </DiffList>
          </>
        )}
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
          </GradeWrapper>
        )}
      </Content>
    </Container>
  );
};

export default SongDetails;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CoverWrapper = styled.div`
  position: relative;
`;

const Cover = styled.img`
  width: 100%;
  height: auto;
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
  width: 24px;
  height: 24px;
`;

const DiffList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const DiffItem = styled.div`
  display: flex;
  align-items: center;
`;

const GradeWrapper = styled.div`
  margin-top: 16px;
`;

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
  width: 40px;
  height: 40px;
`;
