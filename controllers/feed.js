exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post', 
                content:'This is first post', 
                imageUrl: 'images/dog.jpg', 
                creator: {
                    name: 'Nick'
                },
                createdAt: new Date()
    }
]
    });
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    //create post in database
    res.status(201).json({
        message: 'Post created succesfully',
        post: {id: new Date().toISOString(), title: title, content: content}
    });
};