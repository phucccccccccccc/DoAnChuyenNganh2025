var express = require('express');
var router = express.Router();
const category = require('../models/category');

/**
 * LIST CATEGORY
 * GET /admin/category
 */
router.get('/', (req, res) => {
    category.find({})
        .then(result => {
            res.render('admin/category/category-list', {
                layout: 'layouts/admin',
                title: 'Quản lý danh mục',
                categories: result
            });
        })
        .catch(err => res.status(500).send(err));
});


/**
 * CREATE FORM
 * GET /admin/category/create
 */
router.get('/create', (req, res) => {
    res.render('admin/category/create', {
        layout: 'layouts/admin',
        title: 'Thêm danh mục'
    });
});

/**
 * CREATE HANDLE
 * POST /admin/category/create
 */
router.post('/create', (req, res) => {
    console.log(req.body); // test

    const newCategory = new category({
        name: req.body.name,
        image: req.body.image || '',
        status: req.body.status === 'true'
    });

    newCategory.save()
        .then(() => res.redirect('/admin/category'))
        .catch(err => res.status(500).send(err));
});

/**
 * EDIT FORM
 * GET /admin/category/edit/:id
 */
router.get('/edit/:id', (req, res) => {
    category.findById(req.params.id)
        .then(cat => {
            res.render('admin/category/edit', {
                layout: 'layouts/admin',
                title: 'Sửa danh mục',
                category: cat.toObject()
            });
        })
        .catch(err => res.status(500).send(err));
});

/**
 * EDIT HANDLE
 * PUT /admin/category/edit/:id
 */
router.put('/edit/:id', (req, res) => {
    category.findById(req.params.id)
        .then(cat => {
            cat.name = req.body.name;
            cat.image = req.body.image;
            cat.status = req.body.status === 'true';
            return cat.save();
        })
        .then(() => res.redirect('/admin/category'))
        .catch(err => res.status(500).send(err));
});
router.delete('/:id', (req, res) => {
    category.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/admin/category'))
        .catch(err => res.status(500).send(err));
});



module.exports = router;
