const express = require('express');

const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/ocr').post(upload.single('scoreImage'), (req, res) => {
  const imagePath = req.file.path;

  const scriptPath = path.join(__dirname, '../../../ocr/ocr_piupump.py');
  const py = spawn('python3', [scriptPath, imagePath]);
  let data = '';
  py.stdout.on('data', (chunk) => (data += chunk));
  py.on('close', (code) => {
    fs.unlinkSync(imagePath); // cleanup file
    try {
      const result = JSON.parse(data);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: 'OCR failed', details: data });
    }
  });
});

module.exports = router;
