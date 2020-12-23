const http = require('http');
const url = require('url');
const fs = require('fs');

// Create server at port 8080
http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello Node!\n');

    let address = request.url;
    let parseAddress = url.parse(address, true);
    let filePath = '';

    // Log request url and timestamp
    fs.appendFile('log.txt', 'URL: ' + address + '\nTimestamp: ' + new Date() + '\n\n', (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Added to log.');
        }
    });    

    // Check documentation.html
    if (parseAddress.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

}).listen(8080);


//   fs = require('fs'),
//   url = require('url');

// http.createServer((request, response) => {
//   let addr = request.url,
//     q = url.parse(addr, true),
//     filePath = '';

//   fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Added to log.');
//     }
//   });

//   if (q.pathname.includes('documentation')) {
//     filePath = (__dirname + '/documentation.html');
//   } else {
//     filePath = 'index.html';
//   }

//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       throw err;
//     }

//     response.writeHead(200, { 'Content-Type': 'text/html' });
//     response.write(data);
//     response.end();

//   });

// }).listen(8080);
// console.log('My test server is running on Port 8080.');