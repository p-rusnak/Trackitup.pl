import React, { useState } from "react";
import Section from "../../Components/Layout/Section";
import { ApiClient } from "../../API/httpService";
import { Button, Box } from "@mui/material";

const apiClient = new ApiClient();

const AddScore = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    apiClient
      .ocrScore(file)
      .then((res) => setResult(res.data))
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  };

  return (
    <Section header="Add Score">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button variant="contained" disabled={!file || loading} onClick={handleUpload}>
        Upload
      </Button>
      {result && (
        <Box component="pre" sx={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(result, null, 2)}
        </Box>
      )}
    </Section>
  );
};

export default AddScore;
