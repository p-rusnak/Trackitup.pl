import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import GradeSelect from "../../Components/GradeSelect";
import packs from "../../consts/packs";
import Tesseract from "tesseract.js";

const SongDetails = ({ chart, changeGrade, updateDiff }) => {
  const [grade, setGrade] = useState(chart.grade || "");
  const [goal, setGoal] = useState(chart.goal || "");
  const [adiff, setAdiff] = useState(chart.adiff || "");
  const [tags, setTags] = useState(chart.tag ? chart.tag.join(", ") : "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");

  const tagOptions = [
    { color: "red", label: "drill" },
    { color: "yellow", label: "gimmick" },
    { color: "green", label: "twist" },
    // { color: "blue", label: "jack/jump" },
    { color: "blue", label: "bracket" },
    { color: "black", label: "half" },
  ];

  const toggleTag = (tag) => {
    const arr = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    if (arr.includes(tag)) {
      setTags(arr.filter((t) => t !== tag).join(", "));
    } else {
      arr.push(tag);
      setTags(arr.join(", "));
    }
  };
  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setSelectedImage(URL.createObjectURL(image));
  };

  chart.diffs.sort((a, b) => {
    if (a.type > b.type) return -1;
    if (a.type < b.type) return 1;

    if (a.diff > b.diff) return 1;
    if (a.diff < b.diff) return -1;

    return 0;
  });

  const recognizeText = async () => {
    if (selectedImage) {
      const result = await Tesseract.recognize(selectedImage);
      setRecognizedText(result.data.text);
      console.log(result);
    }
  };

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

      <GradeSelect
        label="Set Grade"
        value={grade}
        onChange={(e) => {
          setGrade(e.target.value);
          changeGrade(e.target.value);
        }}
      />
      {grade && (
        <Button
          onClick={() => {
            setGrade();
            changeGrade();
          }}
        >
          Remove
        </Button>
      )}
      {/* <GradeSelect
            label="Set Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
        /> */}
      <div />
      <div>
        <TextField
          label="Adiff"
          value={adiff}
          onChange={(e) => setAdiff(e.target.value)}
        />
        <div>
          {tagOptions.map(({ color, label }) => {
            const selected = tags
              .split(",")
              .map((t) => t.trim())
              .includes(label);
            return (
              <Button
                key={label}
                variant={selected ? "contained" : "outlined"}
                onClick={() => toggleTag(label)}
                style={{
                  backgroundColor: color,
                  color: "white",
                  marginRight: "4px",
                  marginTop: "4px",
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>
        <Button
          onClick={() => {
            updateDiff(chart.id, chart.mode, chart.diff, adiff, tags);
          }}
        >
          Save
        </Button>
      </div>
      <div>
        test
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {/* {selectedImage && <img src={selectedImage} alt="Selected" />} */}
        {recognizedText && <div>{recognizedText}</div>}
      </div>
      <Button onClick={recognizeText}>Add Score</Button>
      {/* <Button>Add To Favorite</Button> */}
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
