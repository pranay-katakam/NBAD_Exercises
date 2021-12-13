const User = require('../models/user');

exports.index = (req, res) => {
    res.render('../index');
};

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.login = (req, res) => {
    res.render('./user/login');
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    User.findById(id)
        .then(user => res.render('./user/profile', { user }))
        .catch(err => next(err));
};

//logout
exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });
};

exports.create = (req, res) => {
    let user = new User(req.body);
    user.save()
        .then(() => res.render('./user/login'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                res.redirect('/users/new');
            }
            if (err.code === 11000) {
                req.flash('error', 'email address is already in use');
                res.redirect('/users/new');
            }
            next(err);
        });
};

exports.loginUser = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id; //store user id in session
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/users/profile');
                        } else {
                            req.flash('error', 'wrong password!!!');
                            res.redirect('/users/login');
                        }
                    })
                    .catch(err => next(err));
            } else {
                //console.log('wrong email address');
                req.flash('error', 'wrong email address!!!');
                res.redirect('/users/login');
            }
        })
        .catch(err => next(err));
};