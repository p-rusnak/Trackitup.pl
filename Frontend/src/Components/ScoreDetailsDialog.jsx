import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

const ScoreDetailsDialog = ({ open, onClose, score }) => {
  if (!score) return null;
  const row = (label, value) => (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>{value ?? '-'}</TableCell>
    </TableRow>
  );
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Score Details</DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableBody>
            {row('Grade', score.grade || '-')}
            {row('Total', score.total)}
            {row('Perfects', score.perfects)}
            {row('Greats', score.greats)}
            {row('Good', score.good)}
            {row('Bad', score.bad)}
            {row('Misses', score.misses)}
            {row('Max Combo', score.combo)}
            {row('Comment', score.comment)}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDetailsDialog;
