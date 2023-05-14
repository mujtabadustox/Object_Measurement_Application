const express = require("express");
const path = require("path");
const multer = require("multer");
const { spawn } = require("child_process");
const cors = require("cors"); // Import the cors package

const app = express();
const port = 4000;

// Use the cors middleware
app.use(cors());

// Multer configuration
const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

// Serve static files
app.use(express.static(path.join(__dirname, "public/uploads")));

// Express route to handle file upload
// Express route to handle file upload
app.post("/backend/process-image", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;

  const pythonProcess = spawn("python", [
    path.join(__dirname, "detect.py"),
    imagePath,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    const outputImagePath = data.toString().trim();
    res.send({ imagePath: outputImagePath }); // Send the path of the processed image
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
    res.status(500).send("An error occurred during image processing.");
  });
});

//handle
app.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.type("image/png");
  const imagePath = path.join(__dirname, "public/uploads", imageName);

  res.sendFile(imagePath);
});

// Handle other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
