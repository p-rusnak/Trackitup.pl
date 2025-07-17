import React, { useEffect, useState } from "react";
import { ApiClient } from "../API/httpService";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import {
  getStoredSessionId,
  SESSION_ID_EVENT,
  storeSessionId,
} from "../helpers/sessionUtils";

const api = new ApiClient();

const SessionBanner = () => {
  const [sessionId, setSessionId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const stored = getStoredSessionId();
    if (stored) {
      setSessionId(stored);
    } else {
      api
        .getCurrentSession()
        .then((r) => {
          if (r.status === 204) storeSessionId(null);
          else storeSessionId(r.data.id);
        })
        .catch(() => storeSessionId(null));
    }

    const handler = (e) => setSessionId(e.detail || null);
    window.addEventListener(SESSION_ID_EVENT, handler);
    return () => window.removeEventListener(SESSION_ID_EVENT, handler);
  }, []);
  if (!sessionId) return null;
  return (
    <Box sx={{ textAlign: "center", p: 1, backgroundColor: "#ffc" }}>
      <Link to="/session">See your current session</Link>
    </Box>
  );
};

export default SessionBanner;
