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