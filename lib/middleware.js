const url = require('url');
const chalk = require('chalk');

module.exports = {
    mimeTypes: {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.mp3': 'audio/mpeg',
    },
    logger: req => {
        console.log(`${chalk.red(req.method)}  ${chalk.cyan(req.url)}  ${chalk.grey(new Date().toLocaleTimeString())}`)
    },
    allowedHost: (req, res) => {
        if (req.headers.host !== process.env.HOST) {
            res.statusCode = 403;
            return res.end();
        };
    },
    parseRequestURL: req => {
        const parsedURL = url.parse(req.url, true);
        return { parsedURL, parsedPath: parsedURL.pathname.replace(/^\/+|\/+$/g, '') };
    },
    parseFormData: buffer => {
        try {
            const data = {};
            buffer = buffer.split('&').forEach(pairs => {
                pairs = pairs.split('=').map(value => value.replace(/\+/g, '').toLowerCase());
                data[pairs[0]] = pairs[1];
            });
            return data;
        }
        catch (err) { return {} };
    },
    parseJsonToObject: buffer => {
        try { return JSON.parse(buffer) }
        catch (err) { return {} }
    },
    parseCookie: cookies => {
        if (cookies) {
            const map = new Map();
            cookies.split('; ').forEach(cookie => {
                cookie = cookie.split('=');
                map.set(cookie[0].trim(), cookie[1].trim());
            });
            return map.get('_id') || null;
        };
        return null;
    },
    createCookieExpiry: () => {
        return new Date(new Date().getTime() + (86409000 * 30)).toUTCString();
    },

    expireCookie: () => {
        return new Date(1).toUTCString();
    },
};






