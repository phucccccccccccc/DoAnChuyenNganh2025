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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials')); //khai bao partials


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

const mongoose = require('mongoose');
const User = require('./models/User'); // đường dẫn tới model User của bạn
const bcryptjs = require('bcrypt'); // bcryptjs hoặc bcrypt
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/node')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Error connected to MongoDB",err));


// app.js
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Kiểm tra password khớp
    if(password !== confirmPassword){
        return res.send("Passwords do not match!");
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.send("Email already exists!");
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    await newUser.save();

    res.send(`
        <script>
            alert('Đăng ký thành công!');
            window.location.href = '/admin/login';
        </script>
    `);
});
app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            bcryptjs.compare(req.body.password, user.password, (err, matched) => {
                if (err) return res.status(500).send("Server error");

                if (matched) {
                    // Login thành công → redirect sang /admin
                    res.redirect('/admin');
                } else {
                    res.send("Sai mật khẩu");
                }
            });
        } else {
            res.send("Email không tồn tại");
        }
    }).catch(err => res.status(500).send("Server error"));
});

// catch 404 and forward to error handler


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
