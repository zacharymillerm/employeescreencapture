const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const employeeId = req.body.employeeId; // Capture employeeId from the request body
        if (!employeeId) {
            return cb(new Error('Employee ID is missing'), null);
        }

        const employeeDir = `uploads/${employeeId}`;
        if (!fs.existsSync(employeeDir)) {
            fs.mkdirSync(employeeDir, { recursive: true });
        }
        cb(null, employeeDir);
    },
    filename: (req, file, cb) => {
        // Use the original file name
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('screenshot'), (req, res) => {

    if (!req.file) {
        return res.status(400).send({ error: 'File upload failed' });
    }

    res.status(200).send({
        message: 'File uploaded successfully',
        filePath: `${req.file.destination}/${req.file.originalname}`,
    });
});

module.exports = router;
