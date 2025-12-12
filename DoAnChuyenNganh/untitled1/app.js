var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();


const session = require('express-session');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials')); //khai bao partials

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);



const mongoose = require('mongoose');
const User = require('./models/User'); // đường dẫn tới model User của bạn
const bcryptjs = require('bcrypt'); // bcryptjs hoặc bcrypt
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect('mongodb://127.0.0.1:27017/node')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Error connected to MongoDB", err));



app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.send("Lỗi khi đăng xuất");
        }
        res.redirect('/admin/login'); // về trang đăng nhập
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

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.render('admin/login', {
                emailError: "Email không tồn tại",
                email: email
            });
        }

        bcryptjs.compare(password, user.password, (err, matched) => {

            if (!matched) {
                return res.render('admin/login', {
                    passwordError: "Sai mật khẩu",
                    email: email
                });
            }

            // Đăng nhập thành công
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
