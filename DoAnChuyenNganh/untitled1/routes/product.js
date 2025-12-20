const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');

// =======================
// FORM CREATE PRODUCT
// GET /admin/product/create
// =======================

router.get('/', async (req, res) => {
    const products = await Product
        .find()
        .populate('category')
        .lean();

    res.render('admin/product/product-list', {
        layout: 'layouts/admin',
        title: 'Quản lý sản phẩm',
        products
    });
});


router.get('/create-product', async (req, res) => {
    try {
        const categories = await Category.find({ status: true }).lean();

        res.render('admin/product/create-product', {
            layout: 'layouts/admin',
            title: 'Thêm xe',
            categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi load form create product');
    }
});

// =======================
// HANDLE CREATE PRODUCT
// POST /admin/product/create
// =======================
router.post('/create-product', async (req, res) => {
    try {
        const { name, image, price, category, status } = req.body;

        const newProduct = new Product({
            name: name.trim(),
            image: image.trim(),
            price: price.trim(),
            category,
            status: status === 'true'
        });

        await newProduct.save();

        res.redirect('/admin/product');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi tạo product');
    }
});

router.get('/edit-product/:id', async (req, res) => {
    try {
        const product = await Product
            .findById(req.params.id)
            .populate('category')
            .lean();

        const categories = await Category.find({ status: true }).lean();

        res.render('admin/product/edit-product', {
            layout: 'layouts/admin',
            title: 'Sửa xe',
            product,
            categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi load form edit product');
    }
});
router.put('/edit-product/:id', async (req, res) => {
    try {
        const { name, image, price, category, status } = req.body;

        await Product.findByIdAndUpdate(req.params.id, {
            name: name.trim(),
            image: image ? image.trim() : '',
            price: price.trim(),
            category,
            status: status === 'true'
        });

        res.redirect('/admin/product');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi cập nhật product');
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/product');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi xóa product');
    }
});



module.exports = router;
