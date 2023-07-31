const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POSTS /feed/post
router.post('/post', feedController.createPost);

module.exports = router;