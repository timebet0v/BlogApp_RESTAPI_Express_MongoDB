const PostModel = require('../models/post.model');

/*  CRUD Operations
  1. C => Create | Creating new data
  2. R => Read   | Fetching data from database
  3. U => Update | Updating or Modifying already existing data
  4. D => Delete | Removing data from database
*/

// GET - Fetching all posts
const getAll = async (req, res) => {
  const { limit } = req.query;
  try {
    let posts = await PostModel.find().limit(Number(limit) || 10);
    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'Not found any posts!' });
  }
};

// GET - Getting one post with given ID
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findById(id);
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: " We're sorry! Not found any post with given id." });
  }
};

// POST - Creating a brand new post and saving
const createPost = async (req, res) => {
  let newPost = new PostModel({
    title: req.body.title,
    body: req.body.body,
  });

  try {
    await newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Couldn't save the post!" });
  }
};

// PUT - updating the data
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    let newPost = { title, body };
    let post = await PostModel.findByIdAndUpdate(id, newPost);
    res.status(200).json({
      message: 'Post has been updated successfully!',
      dataUpdated: { from: post, to: newPost },
    });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: "We're sorry! But, something went wrong." });
  }
};

// DELETE - removing the data
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Post with given id has been removed successfully!',
      removedData: post,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: "We're sorry! But something went wrong!",
    });
  }
};

// Exporting in order to use in the routes...
module.exports = {
  getAll,
  getById,
  createPost,
  updatePost,
  deletePost,
};
