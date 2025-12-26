const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// BLOG LIST
router.get('/blogs', async (req, res) => {
    const blogs = await Blog
        .find({ status: true })
        .sort({ createdAt: -1 })
        .lean();

    res.render('home/blog', {
        layout: 'layouts/home',
        title: 'Blog',
        blogs
    });
});

// BLOG DETAIL
router.get('/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).lean();

    if (!blog) return res.redirect('/blogs');

    res.render('home/blog-details', {
        layout: 'layouts/home',
        title: blog.title,
        blog
    });
});

module.exports = router;
