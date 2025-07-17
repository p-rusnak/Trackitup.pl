import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import SongDetails from "./SongDetails";
import songs from "../../consts/songs";
import { ApiClient } from "../../API/httpService";

const SongPage = () => {
  const { id, diff, mode } = useParams();
  const [chart, setChart] = useState(null);
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
    } else {
      setChart({ id, ...song, diff, mode, fav });
    }
  }, [id, diff, mode, favorites]);

  const changeGrade = (value) => {
    const api = new ApiClient();
    api
      .postScores(mode, { song_id: id, diff, grade: value })
      .then(() => setChart((c) => ({ ...c, grade: value })));
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

  if (!chart) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <SongDetails
        chart={chart}
        changeGrade={changeGrade}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default SongPage;
