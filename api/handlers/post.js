const Post = require("../models/posts");

module.exports = {
  getPosts: async (req, res) => {
    await Post.find()
      .select("description url imageUrl imagePublicId createdAt")
      .sort({ createdAt: -1 })
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: "Seems like no post found" });
        }
        res.send(result);
        return res.status(200, result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },

  getPost: async (req, res) => {
    await Post.findById(`${req.params.id}`)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: "Seems like no post found" });
        }
        res.send(result);
        return res.status(200, result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },

  createPost: async (req, res) => {
    let errors = {};

    if (req.body.description.trim() === "")
      errors.description = "description can not be empty";
    if (req.body.url.trim() === "") errors.url = "url can not be empty";
    if (req.body.imageUrl.trim() === "")
      errors.imageUrl = "imageUrl can not be empty";
    if (req.body.imagePublicId.trim() === "")
      errors.imagePublicId = "imagePublicId can not be empty";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const post = new Post({
      description: req.body.description,
      url: req.body.url,
      imageUrl: req.body.imageUrl,
      imagePublicId: req.body.imagePublicId,
    });

    await post
      .save()
      .then((result) => {
        res.send(result);
        return res.status(201).json(result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },

  deletePost: async (req, res) => {
    await Post.findByIdAndDelete(`${req.params.id}`)
      .then((result) => {
        if (!result) {
          return res
            .status(404)
            .json({ error: "Seems like no post found to delete" });
        }
        res.send(result);
        return res.status(200, result);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.code });
      });
  },
};