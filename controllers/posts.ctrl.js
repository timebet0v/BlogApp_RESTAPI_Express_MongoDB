const PostModel = require('../models/post.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('./error.ctrl');

/*  CRUD Operations
  1. C => Create | Creating new data
  2. R => Read   | Fetching data from database
  3. U => Update | Updating or Modifying already existing data
  4. D => Delete | Removing data from database
*/

// GET - Fetching all posts
const getAllPosts = catchAsync(async (req, res, next) => {
  const { limit } = req.query;

  let posts = await PostModel.find()
    .limit(Number(limit) || 5)
    .select('title');
  if (posts.length === 0) {
    return res.status(200).json({ result: 'There no posts!' });
  }
  return res.status(200).json({ results: posts.length, data: posts });
});

// GET - Getting one post with given ID
const getPostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await PostModel.findById(id);
  if (!post) {
    return next(new AppError('Not found any post with given id!', 404));
  }
  res.status(200).json({ success: true, data: post });
});

// POST - Creating a brand new post and saving
const createPost = catchAsync(async (req, res) => {
  const postData = {
    title: req.body.title,
    body: req.body.body,
  };

  let newPost = new PostModel(postData);

  await newPost.save();
  res.status(201).json({ success: true, data: newPost });
});

// PUT - updating the data
const updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const postData = {
    title: req.body.title,
    body: req.body.body,
    updatedAt: Date.now(),
  };

  const post = await PostModel.findByIdAndUpdate(id, postData);

  if (!post) {
    return next(new AppError('Not found any post with given id!', 404));
  }

  res.status(200).json({
    message: 'Post has been updated successfully!',
    updatedPost: post,
  });
});

// DELETE - removing the data
const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await PostModel.findByIdAndDelete(id);

  if (!post) {
    return next(new AppError('Not found any post with given id!', 404));
  }

  res.status(200).json({
    success: true,
    message: `Post with given id: ${id} has been removed successfully!`,
    removedData: post,
  });
});

// Exporting in order to use in the routes...
module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
