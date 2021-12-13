const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

//GET /users/new: Add new user
router.get('/new', controller.new);

//GET /users/login: login a user
router.get('/login', controller.login);

//GET /users/profile: show profile
router.get('/profile', controller.profile);

//GET /users/logout: user logout
router.get('/logout', controller.logout);

//POST /users
router.post('/', controller.create);

//POST /users/login
router.post('/login', controller.loginUser);

module.exports = router;