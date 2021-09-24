const http = require('http');
const port = 8080;
const host = 'localhost';
const fs = require('fs')

const server = http.createServer((req, res) => {


    console.log(req.method, req.url, req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    let path = './views/'
    if (req.url === '/about') {
        path = path + 'about.html'
    }
    else if (req.url === '/contact') {
        path = path + 'contact.html'
    }
    else  {
        res.statusCode = 404;
        path = path + '404.html'
    }

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            res.write(data);
            res.end;
        }
    });


});


server.listen(port, host, () => {
    console.log("Server is running in port {}", port);

})