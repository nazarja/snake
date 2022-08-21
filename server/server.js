require('dotenv').config();
require('../lib/templates').config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const router = require('./router');
const middleware = require('../lib/middleware');
const { StringDecoder } = require('string_decoder');

const server = {
    static: '/public/'
};

server.httpServer = http.createServer((req, res) => {
    middleware.logger(req);
    middleware.allowedHost(req, res);

    const { parsedURL, parsedPath } = middleware.parseRequestURL(req);

    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => buffer += decoder.write(data));

    req.on('end', () => {
        buffer += decoder.end();

        if (req.url.startsWith(server.static)) {
            const filePath = `.${req.url}`;
            const extname = String(path.extname(filePath)).toLowerCase();

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.statusCode = 404;
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': middleware.mimeTypes[extname] });
                    res.end(content, 'utf-8');
                };
            });
        }
        else {
            const routeHandler = router[parsedPath] === undefined
                ? router.notfound
                : router[parsedPath];

            let requestData = {
                headers: req.headers,
                method: req.method.toLowerCase(),
                path: parsedPath,
                query: parsedURL.query,
                formData: middleware.parseFormData(buffer),
                payload: middleware.parseJsonToObject(buffer),
                user: null
            };

            requestData.user = middleware.parseCookie(req.headers.cookie);

            routeHandler(res, requestData, (statusCode, payload) => {
                if ([200, 404].includes(statusCode)) {
                    res.setHeader('Content-Type', 'text/html');
                    res.writeHead(statusCode);
                    res.end(payload);
                }
                else {
                    res.writeHead(statusCode, payload);
                    res.end();
                };
            });
        };
    });
});

server.init = () => {
    server.httpServer.listen(process.env.PORT,() => 
        console.log(`Server is running on http://localhost:${process.env.PORT}`)
    );
};

module.exports = server;
