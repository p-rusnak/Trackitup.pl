import { MenuItem, Select } from "@mui/material";
import React from "react";
import styled from "styled-components";
import grades from "../../Assets/Grades";

const GradeDropdown = ({ value, label, onChange, size = "small" }) => {
  return (
    <Select
      value={value}
      label={label}
      onChange={onChange}
      defaultValue={"Ap"}
      size={size}
    >
      <MenuItem value={"SSS"}>
        <Grade src={grades.SSS} />
      </MenuItem>
      <MenuItem value={"SS"}>
        <Grade src={grades.SS} />
      </MenuItem>
      <MenuItem value={"S"}>
        <Grade src={grades.S} />
      </MenuItem>
      <MenuItem value={"Ap"}>
        <Grade src={grades.Ap} />
      </MenuItem>
      <MenuItem value={"Bp"}>
        <Grade src={grades.Bp} />
      </MenuItem>
      <MenuItem value={"Cp"}>
        <Grade src={grades.Cp} />
      </MenuItem>
      <MenuItem value={"Dp"}>
        <Grade src={grades.Dp} />
      </MenuItem>
      <MenuItem value={"A"}>
        <Grade src={grades.A} />
      </MenuItem>
      <MenuItem value={"B"}>
        <Grade src={grades.B} />
      </MenuItem>
      <MenuItem value={"C"}>
        <Grade src={grades.C} />
      </MenuItem>
      <MenuItem value={"D"}>
        <Grade src={grades.D} />
      </MenuItem>
      <MenuItem value={"F"}>
        <Grade src={grades.F} />
      </MenuItem>
      <MenuItem value={"Failed"}>
        <Grade src={grades.Failed} />
      </MenuItem>
    </Select>
  );
};

export default GradeDropdown;

const Grade = styled.img`
  height: 30px;
`;
