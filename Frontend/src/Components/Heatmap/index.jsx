import React from "react";
import styled from "styled-components";

const LabelsWrapper = styled.div`
  display: flex;
  margin-left: 0;
`;
const MonthLabel = styled.div`
  width: 14px;
  font-size: 10px;
  text-align: center;
`;

const DayLabelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4px;
  margin-top: 14px;
  width: 20px;
`;

const DayLabel = styled.div`
  margin: 0;
  height: 14px;
  line-height: 14px;
  font-size: 10px;
  text-align: right;
`;

const Wrapper = styled.div`
  display: flex;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const Cell = styled.div`
  width: 12px;
  height: 12px;
  margin: 1px;
  visibility: ${({ hidden }) => (hidden ? "hidden" : "visible")};
  background-color: ${({ level }) =>
    ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"][level]};
`;

const CalendarHeatmap = ({ counts }) => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setHours(0, 0, 0, 0);
  const startDay = start.getDay();
  start.setDate(start.getDate() - ((startDay + 6) % 7));

  const dateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const days = [];
  let d = new Date(start);
  while (d <= today) {
    days.push({ date: new Date(d), count: counts[dateKey(d)] || 0 });
    d.setDate(d.getDate() + 1);
  }
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  const monthLabels = weeks.map((week) => {
    const firstOfMonth = week.find((v) => v && v.date.getDate() === 1);
    if (firstOfMonth) {
      return firstOfMonth.date.toLocaleString("default", { month: "short" });
    }
    return "";
  });
  const max = Math.max(0, ...days.map((dd) => dd.count));
  const level = (c) => {
    if (c === 0 || max === 0) return 0;
    const t = c / max;
    if (t > 0.75) return 4;
    if (t > 0.5) return 3;
    if (t > 0.25) return 2;
    return 1;
  };
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div style={{ display: "flex" }}>
      <DayLabelsWrapper>
        {daysOfWeek.map((d) => (
          <DayLabel key={d}>{d}</DayLabel>
        ))}
      </DayLabelsWrapper>
      <div>
        <LabelsWrapper>
          {monthLabels.map((m, i) => (
            <MonthLabel key={i}>{m}</MonthLabel>
          ))}
        </LabelsWrapper>
        <Wrapper>
          {weeks.map((week, i) => (
            <Column key={i}>
              {Array.from({ length: 7 }).map((_, j) => {
                const day = week[j];
                const count = day ? day.count : 0;
                const dt = day ? dateKey(day.date) : "";
                const hidden = !day;
                return (
                  <Cell
                    key={j}
                    level={level(count)}
                    title={`${dt}: ${count}`}
                    hidden={hidden}
                  />
                );
              })}
            </Column>
          ))}
        </Wrapper>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
