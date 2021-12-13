//require modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect('mongodb://localhost:27017/demos',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        });
    })
    .catch(err => console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

//craete cookie
app.use(session({
    secret: 'mughiwara',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: new MongoStore({ mongoUrl: 'mongodb://localhost:27017/demos' })
}));

//for flash messages
app.use(flash());


app.use((req, res, next) => {
    console.log(req.session);
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});


//set up routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/new', (req, res) => {
    res.render('new');
})


//post request to craete a new users

app.post('/', (req, res) => {
    let user = new User(req.body);
    user.save()
        .then(() => res.redirect('/login'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email address has been used');
            }
            next(err)
        });

});



//get the login form 
app.get('/login', (req, res) => {
    console.log(req.flash());
    res.render('login');
})

//process login request
app.post('/login', (req, res) => {
    //authent user req
    let email = req.body.email;
    let password = req.body.password;

    //get the user that matches the email
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                //user found in db
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;//storing id in session
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/profile');
                        }
                        else {
                            // console.log('Wrong password');
                            req.flash('error', 'Wrong password');
                            res.redirect('/login');
                        }
                    })
            }
            else {
                // console.log("User not found");
                req.flash('error', 'Wrong email address');
                res.redirect('/login');
            }
        })
        .catch(err => next(err));
});


//get profile information
app.get('/profile', (req, res) => {
    let id = req.session.user;
    console.log(req.flash());
    console.log(id);
    User.findById(id)
        .then(user => res.render('profile', { user }))
        .catch(err => next(err));
});

//logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return next(err);
        else res.redirect('/');
    });
});


app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);

});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', { error: err });
});
