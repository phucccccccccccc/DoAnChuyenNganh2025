const express = require('express');
const router = express.Router();
const Blog = require('../../models/Blog');

/**
 * BLOG LIST
 */
router.get('/', async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

    res.render('admin/blog/index', {
        layout: 'layouts/admin',
        title: 'Quản lý Blog',
        blogs
    });
});

/**
 * CREATE FORM
 */
router.get('/create', (req, res) => {
    res.render('admin/blog/create', {
        layout: 'layouts/admin',
        title: 'Thêm Blog'
    });
});

/**
 * CREATE POST
 */
router.post('/create', async (req, res) => {
    const { title, image, description, author, category, status } = req.body;

    await Blog.create({
        title,
        image,
        description,
        author,
        category,
        status: status === 'on'
    });

    res.redirect('/admin/blog');
});

/**
 * EDIT FORM
 */
router.get('/:id/edit', async (req, res) => {
    const blog = await Blog.findById(req.params.id).lean();

    if (!blog) return res.redirect('/admin/blog');

    res.render('admin/blog/edit', {
        layout: 'layouts/admin',
        title: 'Sửa Blog',
        blog
    });
});

/**
 * UPDATE
 */
router.post('/:id/edit', async (req, res) => {
    const { title, image, description, author, category, status } = req.body;

    await Blog.findByIdAndUpdate(req.params.id, {
        title,
        image,
        description,
        author,
        category,
        status: status === 'on'
    });

    res.redirect('/admin/blog');
});

/**
 * DELETE
 */
router.post('/:id/delete', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin/blog');
});

module.exports = router;
