const fs = require('fs');

const { validationResult } = require('express-validator/check')

const Post = require('../models/post');
const { Console } = require('console');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query || 1;
    const perPage = 2;
    let totalIltems;
    Post.find()
    .countDocuments()
    .then(count => {
        totalIltems = count;
        return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
    })
    .then(posts => {
        res
        .status(200)
        .jsoN({
            message: 'Fetched posts succesfully', 
            posts: posts, 
            totalIltems: totalIltems 
        })
    })
    .catch(err => {
        if (err.statusCode) {
          err.status = 500;
        }
        next(err);
    })

};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        throw error
    }
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    //create post in database
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: { name: "NICK" },
    });
    post
    .save()
    .then(result => {
    res
  .status(201)
  .json({
    message: "Post created succesfully",
    post: {
      _id: new Date().toISOString(),
      createdAt: new Date(),
    },
  })
  .catch((err) => {});
  if (err.statusCode) {
    err.status = 500;
  }
  next(err);
});
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(prodId)
    .then(post => {
        if (!post) {
            const error = new Error('Could not find a post')
            error.statusCode = 400;
            throw error
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl)
        }
        res.status(200).json({ message: 'Post fetched', post: post })
    })
    .catch( err => {  
    if (err.statusCode) {
    err.status = 500;
  }
  next(err);
})
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         const error = new Error("Validation failed");
         error.statusCode = 422;
         throw error;
    }
    const title = req.params.title;
    const content = req.params.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw err;
    }

    Post.findById(postId)
      .then(post => {
        if (!post) {
            const error = new Error("Validation failed");
            error.statusCode = 422;
            throw error;
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
      })
      .then(result => {
        res.status(200).json({message: 'Post updated!', post: result});
      })
      .catch((err) => {
        if (err.statusCode) {
          err.status = 500;
        }
        next(err);
      });
}

exports.deletePost =(req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error("Could not find a post");
            error.statusCode = 400;
            throw error;
        }
        //checked logged in user
        clearImage(post.imageUrl);
        return post.findByIdAndRemove(postId)
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Deleted post'});
    })
    .catch((err) => {
        if (err.statusCode) {
          err.status = 500;
        }
        next(err);
      });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};