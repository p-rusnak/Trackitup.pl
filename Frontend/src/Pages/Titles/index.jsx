import React from 'react';
import Section from '../../Components/Layout/Section';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { clearTitles } from '../../consts/titleRequirements';

const Titles = () => {
  return (
    <Section header="Titles info">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Diffs</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell>Requires</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clearTitles.map((t) => (
            <TableRow key={t.title}>
              <TableCell>{t.title}</TableCell>
              <TableCell>{t.diffs}</TableCell>
              <TableCell align="right">{t.count}</TableCell>
              <TableCell>{t.requires || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
};

export default Titles;
