import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const ShareImageDialog = ({ open, url, onClose }) => {
  const copy = async () => {
    if (!url) return;
    try {
      if (navigator.clipboard && navigator.clipboard.write) {
        const blob = await (await fetch(url)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const download = () => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'session.png';
    a.click();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Share Image</DialogTitle>
      <DialogContent>
        {url && (
          <img
            src={url}
            alt="share"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={copy}>Copy</Button>
        <Button onClick={download}>Download</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareImageDialog;
