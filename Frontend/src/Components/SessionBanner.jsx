import React, { useEffect, useState } from "react";
import { ApiClient } from "../API/httpService";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const api = new ApiClient();

const SessionBanner = () => {
  const [sessionId, setSessionId] = useState(null);
  useEffect(() => {
    const load = () => {
      api
        .getCurrentSession()
        .then((r) => {
          if (r.status === 204) setSessionId(null);
          else setSessionId(r.data.id);
        })
        .catch(() => setSessionId(null));
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);
  if (!sessionId) return null;
  return (
    <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#ffc" }}>
      <Link to="/session">See your current session</Link>
    </Box>
  );
};

export default SessionBanner;
