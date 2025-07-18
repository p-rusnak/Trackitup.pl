import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SongDetails from "./SongDetails";
import songs from "../../consts/songs";
import { ApiClient } from "../../API/httpService";
import { useUser } from "../../Components/User";
import { storeSessionId } from "../../helpers/sessionUtils";

const SongPage = () => {
  const { id, diff, mode } = useParams();
  const navigate = useNavigate();
  const [chart, setChart] = useState(null);
  const [history, setHistory] = useState([]);
  const [rivalScores, setRivalScores] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const { user } = useUser();
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    const song = songs[id];
    if (!song) return;
    const api = new ApiClient();
    const fav = favorites[`${id}-${diff}-${mode}`];
    if (localStorage.getItem("token")) {
      api.getScores(mode).then((r) => {
        const grade = r.data?.[diff]?.[id]?.grade;
        setChart({ id, ...song, diff, mode, grade, fav });
      });
      api.getScoreHistory(mode, id, diff).then((r) => setHistory(r.data));
      api.getRivalScores(mode, id, diff).then((r) => setRivalScores(r.data));
    } else {
      setChart({ id, ...song, diff, mode, fav });
    }
    api.getBestScore(mode, id, diff).then((r) => setBestScore(r.data));
  }, [id, diff, mode, favorites]);

  const changeGrade = (value, skipPost = false) => {
    const api = new ApiClient();
    const post = skipPost
      ? Promise.resolve({ data: {} })
      : api.postScores(mode, { song_id: id, diff, grade: value });
    post.then((r) => {
      const { session } = r.data || {};
      if (session) storeSessionId(session.id);
      setChart((c) => (c ? { ...c, grade: value } : c));
      api.getScoreHistory(mode, id, diff).then((res) => setHistory(res.data));
    });
  };

  const toggleFavorite = () => {
    const key = `${id}-${diff}-${mode}`;
    setFavorites((prev) => {
      const upd = { ...prev };
      if (upd[key]) delete upd[key];
      else upd[key] = true;
      localStorage.setItem("favorites", JSON.stringify(upd));
      return upd;
    });
    setChart((c) => (c ? { ...c, fav: !c.fav } : c));
  };

  const changeDiff = (d) => {
    navigate(`/song/${id}/${d.type}/${d.diff}`);
  };

  const removeScore = (sid) => {
    const api = new ApiClient();
    api.deleteScore(sid).then(() => {
      api.getScores(mode).then((r) => {
        const grade = r.data?.[diff]?.[id]?.grade;
        setChart((c) => (c ? { ...c, grade } : c));
      });
      api.getScoreHistory(mode, id, diff).then((r) => setHistory(r.data));
    });
  };

  if (!chart) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <SongDetails
        chart={chart}
        changeGrade={changeGrade}
        toggleFavorite={toggleFavorite}
        changeDiff={changeDiff}
        history={history}
        rivalScores={rivalScores}
        bestScore={bestScore}
        removeScore={removeScore}
        playHistoryExpanded
      />
    </div>
  );
};

export default SongPage;
