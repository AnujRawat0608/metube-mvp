const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Pool } = require("pg");

console.log("Upload file is loaded");
// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Configure where uploaded videos are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Upload API
router.post("/upload", upload.single("video"), async (req, res) => {
 
    const { title, description } = req.body;
    const videoPath = req.file.path;

    try {
        const result = await pool.query(
            "INSERT INTO videos (title, description, video_url) VALUES ($1,$2,$3) RETURNING *",
            [title, description, videoPath]
        );

        res.json({
            message: "Video uploaded successfully",
            video: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload failed" });
    }
});

module.exports = router;