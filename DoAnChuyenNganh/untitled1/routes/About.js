const express = require('express');
const router = express.Router();
const About = require('../models/About');

router.get('/about', async (req, res) => {
    const about = await About.findOne({ status: true }).lean();

    res.render('home/about', {
        layout: 'layouts/home',
        title: about?.title || 'About Us',
        about
    });
});

module.exports = router;
