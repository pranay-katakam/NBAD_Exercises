//require modules

const express = require('express');
const morgan = require('morgan');
const storyRoute = require('./routes/storyRoute');
const methodOverride = require('method-override');


//create app
const app = express();

//configure app
let port = 3001;
let host = 'localhost';
app.set('view engine', 'ejs');


//mount the middleware 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/stories', storyRoute);

app.use((req, res, next) => {
    let err = new Error('The server cannot locate' + req.url);
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

//start the server
app.listen(port, host, () => {
    console.log('Server is running', port);
});