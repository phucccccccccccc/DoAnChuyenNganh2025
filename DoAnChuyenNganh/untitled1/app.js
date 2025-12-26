var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* ========= ROUTES ========= */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var categoryRouter = require('./routes/category');

const requireAdmin = require('./middlewares/requireAdmin');

const carRouter = require('./routes/car');
const blogRouter = require('./routes/blog');
const productRouter = require('./routes/product');
const aboutRouter = require('./routes/about');

const adminBlogRouter = require('./routes/admin/blog');
const adminContactRouter = require('./routes/admin/contact');
const adminAboutRouter = require('./routes/admin/about');

/* ========= MODEL (FIX LỖI USER) ========= */
const User = require('./models/User'); // ✅ BẮT BUỘC – FIX User is not defined

var app = express();

/* ======================= VIEW ENGINE ======================= */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

hbs.registerHelper('eq', function (a, b) {
    return String(a) === String(b);
});

/* ======================= MIDDLEWARE ======================= */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// USER GLOBAL (layout admin dùng {{user}})
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

/* ======================= ROUTES ======================= */
// ================= FRONT =================
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cars', carRouter);
app.use('/', blogRouter);
app.use('/', aboutRouter);

// ================= ADMIN AUTH (KHÔNG KHÓA) =================
app.use('/admin', adminRouter); // login, register, forgot-password
app.use('/admin/login', adminRouter);
app.use('/admin/register', adminRouter);
app.use('/admin/forgot-password', adminRouter);

// ================= ADMIN PROTECTED =================
app.use('/admin/category', requireAdmin, categoryRouter);
app.use('/admin/product', requireAdmin, productRouter);
app.use('/admin/blog', requireAdmin, adminBlogRouter);
app.use('/admin/contact', requireAdmin, adminContactRouter);
app.use('/admin/about', requireAdmin, require('./routes/admin/about'));

/* ================= ADMIN DASHBOARD ================= */
app.use('/admin', requireAdmin, adminRouter);

/* ======================= DATABASE ======================= */
mongoose
    .connect('mongodb://127.0.0.1:27017/node')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Error:', err));

/* ======================= LOGOUT ======================= */
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Lỗi khi đăng xuất');
        res.redirect('/admin/login');
    });
});


// app.js
// cần: const bcryptjs = require('bcrypt'); const User = require('./models/User');

// app.post('/register', ...)
// cần: const User = require('./models/User');
//       const bcryptjs = require('bcrypt');
//       app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        // templateData giữ lại giá trị input để render lại form nếu có lỗi
        const templateData = { firstName, lastName, email };

        // Collect errors per-field
        const errors = {};            // { emailError: '...', passwordError: '...' }
        const errorsSummary = [];     // ['Email không hợp lệ', 'Mật khẩu quá ngắn', ...]

        // Validate fields
        if (!firstName || !firstName.trim()) {
            errors.firstNameError = 'Nhập First name';
            errorsSummary.push('First name trống');
        }

        if (!lastName || !lastName.trim()) {
            errors.lastNameError = 'Nhập Last name';
            errorsSummary.push('Last name trống');
        }

        if (!email || !email.trim()) {
            errors.emailError = 'Nhập email';
            errorsSummary.push('Email trống');
        } else {
            // basic email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.emailError = 'Email không hợp lệ';
                errorsSummary.push('Email không hợp lệ');
            }
        }

        if (!password) {
            errors.passwordError = 'Nhập mật khẩu';
            errorsSummary.push('Password trống');
        } else if (password.length < 6) {
            errors.passwordError = 'Mật khẩu tối thiểu 6 ký tự';
            errorsSummary.push('Password quá ngắn (ít nhất 6 ký tự)');
        }

        if (!confirmPassword) {
            errors.confirmPasswordError = 'Xác nhận mật khẩu';
            errorsSummary.push('Confirm password trống');
        } else if (password && password !== confirmPassword) {
            errors.passwordError = 'Mật khẩu không khớp';
            errors.confirmPasswordError = 'Mật khẩu không khớp';
            errorsSummary.push('Mật khẩu và xác nhận không khớp');
        }

        // Nếu đã có lỗi client-side, render lại kèm errors
        if (Object.keys(errors).length > 0) {
            return res.render('admin/register', {
                ...templateData,
                ...errors,
                errorsSummary
            });
        }

        // Kiểm tra email tồn tại (server-side)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            errors.emailError = 'Email đã tồn tại';
            errorsSummary.push('Email đã tồn tại');
            return res.render('admin/register', {
                ...templateData,
                ...errors,
                errorsSummary
            });
        }

        // Nếu không có lỗi → tạo user
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();

        // Sau đăng ký thành công: dùng flash 1 lần (session) hoặc redirect với query flag
        req.session.success = 'Đăng ký thành công. Vui lòng đăng nhập.';
        return res.redirect('/admin/login');

    } catch (err) {
        console.error('Register error:', err);
        return res.render('admin/register', {
            error: 'Có lỗi hệ thống. Vui lòng thử lại sau.'
        });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const errors = {};

    // ==========================
    // 1) KIỂM TRA RỖNG
    // ==========================
    if (!email || email.trim() === "") {
        errors.emailError = "Vui lòng nhập email";
    }

    if (!password || password.trim() === "") {
        errors.passwordError = "Vui lòng nhập mật khẩu";
    }

    // ==========================
    // 1.5) KIỂM TRA ĐỊNH DẠNG EMAIL
    // ==========================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.emailError = "Email không hợp lệ";
    }

    // ❌ Có lỗi → render lại
    if (Object.keys(errors).length > 0) {
        return res.render('admin/login', {
            ...errors,
            email
        });
    }

    // ==========================
    // 2) KIỂM TRA EMAIL TỒN TẠI
    // ==========================
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.render('admin/login', {
                emailError: "Email không tồn tại",
                email
            });
        }

        // ==========================
        // 3) KIỂM TRA MẬT KHẨU
        // ==========================
        bcrypt.compare(password, user.password, (err, matched) => {
            if (!matched) {
                return res.render('admin/login', {
                    passwordError: "Sai mật khẩu",
                    email
                });
            }

            // ==========================
            // 4) LOGIN THÀNH CÔNG
            // ==========================
            req.session.user = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };

            res.redirect('/');
        });
    });
});


// catch 404 and forward to error handler

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
