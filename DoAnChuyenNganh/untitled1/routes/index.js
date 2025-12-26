const express = require('express');
const router = express.Router();

const Category = require('../models/category');
const Car = require('../models/car');
const Blog = require('../models/Blog');
const About = require('../models/About'); // ❌ THIẾU → PHẢI THÊM
const Product  = require('../models/product'); // ✅ DÙNG PRODUCT
const Contact = require('../models/Contact');


/**
 * HOME
 */
router.get('/', async (req, res) => {
    const categories = await Category.find({ status: true }).lean();

    res.render('home/index', {
        layout: 'layouts/home',
        title: 'Trang chủ',
        categories,
        isHome: true
    });
});

/**
 * ALL CARS
 */
router.get('/car', async (req, res) => {
    const cars = await Product.find({ status: true }).lean();
    const categories = await Category.find({ status: true }).lean();

    res.render('home/cars', {
        layout: 'layouts/home',
        title: 'Danh sách xe',
        cars,
        categories,
        isCars: true
    });
});

/**
 * CARS BY CATEGORY
 */
/**
 * CAR DETAILS (GIỐNG ABOUT)
 */
// CAR DETAILS (LẤY DATA TỪ DB)
router.get('/cars/:id', async (req, res) => {
    const car = await Product.findById(req.params.id)
        .populate('category')
        .lean();

    console.log('CAR DETAIL:', car);

    if (!car) return res.redirect('/cars');

    res.render('home/car-details', {
        layout: 'layouts/home',
        title: car.name,
        car
    });
});

/**
 * CAR DETAILS
 */
router.get('/car-details', (req, res) => {
    res.render('home/car-details', {
        layout: 'layouts/home',
        title: 'Chi tiết xe'
    });
});

/**
 * BLOG LIST
 */
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

/**
 * ABOUT (LẤY DATA TỪ MONGO)
 */
router.get('/about', async (req, res) => {
    const about = await About.findOne({ status: true }).lean();

    console.log('ABOUT DATA:', about);

    res.render('home/about', {
        layout: 'layouts/home',
        title: 'About Us',
        about
    });
});


/**
 * CONTACT
 */
router.get('/contact', (req, res) => {
    res.render('home/contact', {
        layout: 'layouts/home',
        title: 'Contact'
    });
});
router.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    await Contact.create({
        name,
        email,
        subject,
        message
    });

    res.redirect('/contact');
});


/**
 * CUSTOMER
 */


module.exports = router;
