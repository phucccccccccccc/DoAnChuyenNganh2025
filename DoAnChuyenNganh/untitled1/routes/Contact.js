const Contact = require('../models/Contact');

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
