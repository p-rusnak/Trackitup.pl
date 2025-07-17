import React, { useEffect, useState } from 'react';
import Section from '../../Components/Layout/Section';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CheckIcon from '@mui/icons-material/Check';
import { clearTitles } from '../../consts/titleRequirements';
import { songBadges, metaBadges } from '../../consts/badges';
import { ApiClient } from '../../API/httpService';
import { formatBadge } from '../../helpers/badgeUtils';

const Titles = () => {
  const [ownedTitles, setOwnedTitles] = useState([]);
  const [ownedBadges, setOwnedBadges] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const api = new ApiClient();
      api.getUser(payload.sub).then((r) => {
        setOwnedTitles(r.data.titles || []);
        setOwnedBadges(r.data.badges || []);
      });
    } catch (e) {
      console.error('Failed to load user achievements', e);
    }
  }, []);

  const badgeRows = [];
  Object.entries(songBadges).forEach(([cat, reqs]) => {
    reqs.forEach((req) => {
      const key = req.level === 'Expert' ? metaBadges[cat] : `${cat}_${req.level}`;
      badgeRows.push({
        key: `${cat}-${req.level}`,
        badge: key,
        song: req.song,
        diff: req.diff,
        mode: req.mode,
        grade: req.grade,
      });
    });
  });
  badgeRows.push({ key: 'specialist', badge: metaBadges.specialist });

  return (
    <>
      <Section header="Titles info">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Diffs</TableCell>
              <TableCell align="right">Count</TableCell>
              <TableCell>Requires</TableCell>
              <TableCell>Owned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clearTitles.map((t) => (
              <TableRow key={t.title}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.diffs}</TableCell>
                <TableCell align="right">{t.count}</TableCell>
                <TableCell>{t.requires || '-'}</TableCell>
                <TableCell align="center">
                  {ownedTitles.includes(t.title) && (
                    <CheckIcon color="success" fontSize="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
      <Section header="Badges info">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Badge</TableCell>
              <TableCell>Song</TableCell>
              <TableCell>Diff</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Owned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {badgeRows.map((b) => (
              <TableRow key={b.key}>
                <TableCell>{formatBadge(b.badge)}</TableCell>
                <TableCell>
                  {b.song ? (
                    <SongLink to={`/song/${b.song}/${b.mode}/${b.diff}`}>{b.song}</SongLink>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{b.diff || '-'}</TableCell>
                <TableCell>{b.mode ? b.mode.replace('item_', '') : '-'}</TableCell>
                <TableCell>{b.grade || (b.song ? 'SS' : '-')}</TableCell>
                <TableCell align="center">
                  {ownedBadges.includes(b.badge) && (
                    <CheckIcon color="success" fontSize="small" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </>
  );
};

export default Titles;

const SongLink = styled(Link)`
  color: inherit;
  text-decoration: underline;
`;
