// Routes/blog.js
const Router = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();
const blog = require("../Models/blog");
const comment = require("../Models/comment");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const allBlogs = await blog
      .find({})
      .populate("createdBy", "fullname profileImageURL");
    res.json(allBlogs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single blog with its comments
router.get("/:blogid", async (req, res) => {
  try {
    const blogEntry = await blog
      .findById(req.params.blogid)
      .populate("createdBy", "fullname profileImageURL");
    const comments = await comment
      .find({ blogId: req.params.blogid })
      .populate("createdBy", "fullname profileImageURL");
    res.json({ blog: blogEntry, comments });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new blog (requires authentication)
router.post("/", upload.single("coverImage"), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { title, body } = req.body;
  try {
    const newBlog = await blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: req.file ? `/uploads/${req.file.filename}` : "",
    });
    res.json({ message: "Blog created", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a comment to a blog (requires authentication)
router.post("/:blogid/comment", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const newComment = await comment.create({
      content: req.body.content,
      blogId: req.params.blogid,
      createdBy: req.user._id,
    });
    res.json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
