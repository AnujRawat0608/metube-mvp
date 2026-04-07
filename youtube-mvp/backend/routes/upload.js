const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const { createClient } = require("@supabase/supabase-js");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

console.log("Upload file loaded");

// ================= DATABASE =================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ================= SUPABASE =================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ================= MULTER =================
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// ================= TEMP FOLDER =================
const tempDir = "./temp";

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ================= UPLOAD API =================
router.post("/upload", upload.single("video"), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uniqueName = Date.now() + path.extname(file.originalname);

  const tempVideoPath = `${tempDir}/temp-${uniqueName}`;
  const thumbnailName = `thumb-${uniqueName}.png`;
  const thumbnailPath = `${tempDir}/${thumbnailName}`;

  try {
    // ================= STEP 1: SAVE TEMP VIDEO =================
    fs.writeFileSync(tempVideoPath, file.buffer);

    // ================= STEP 2: GENERATE THUMBNAIL =================
    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .screenshots({
          count: 1,
          filename: thumbnailName,
          folder: tempDir,
          size: "320x240",
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // ================= STEP 3: UPLOAD VIDEO =================
    const { error: videoError } = await supabase.storage
      .from("videos")
      .upload(uniqueName, file.buffer, {
        contentType: file.mimetype,
      });

    if (videoError) {
      console.error("Video upload error:", videoError);
      return res.status(500).json({ message: "Video upload failed" });
    }

    // ================= STEP 4: UPLOAD THUMBNAIL =================
    const thumbBuffer = fs.readFileSync(thumbnailPath);

    const { error: thumbError } = await supabase.storage
      .from("videos")
      .upload(thumbnailName, thumbBuffer, {
        contentType: "image/png",
      });

    if (thumbError) {
      console.error("Thumbnail upload error:", thumbError);
      return res.status(500).json({ message: "Thumbnail upload failed" });
    }

    // ================= STEP 5: GET PUBLIC URLS =================
    const videoUrl = supabase.storage
      .from("videos")
      .getPublicUrl(uniqueName).data.publicUrl;

    const thumbnailUrl = supabase.storage
      .from("videos")
      .getPublicUrl(thumbnailName).data.publicUrl;

    // ================= STEP 6: SAVE IN DB =================
    const result = await pool.query(
      `INSERT INTO videos (title, description, video_url, thumbnail_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description, videoUrl, thumbnailUrl]
    );

    res.json({
      message: "Upload successful",
      video: result.rows[0],
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });

  } finally {
    // ================= CLEANUP =================
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
    if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
  }
});

// ================= GET VIDEOS =================
router.get("/videos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM videos ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching videos");
  }
});

module.exports = router;