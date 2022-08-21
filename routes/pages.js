const nunjucks = require('nunjucks');
const helpers = require('../lib/helpers');
const middleware = require('../lib/middleware');
const { db } = require('../lib/db');

module.exports = {
    game: (res, data, callback) => {
        const context = { active: 'game', user: data.user };
        return callback(200, nunjucks.render('game.njk', context));
    },
    about: (res, data, callback) => {
        const context = { active: 'about', user: data.user };
        return callback(200, nunjucks.render('about.njk', context));
    },
    profile: async (res, data, callback) => {
        const context = { active: 'profile', user: data.user, errors: false, gameData: null };

        if (data.method === 'post') {
            const user = await db.getUser(data.formData.username);

            if (user) {
                const isAuth = await helpers.comparePassword(data.formData.password, user.password);
                if (isAuth) context.user = user._id;
                else return callback(302, { location: '/profile?errors=1' });
            }
            else {
                data.formData.password = await helpers.hashPassword(data.formData.password);
                const userId = await db.createUser(data.formData);
                context.user = userId;
            };

            res.setHeader('Set-Cookie', `_id=${context.user}; expires=${middleware.createCookieExpiry()}; HttpOnly`);
            return callback(302, { location: '/profile' });
        };

        if (data.query?.errors) context.errors = true;
        else if (context.user && data.method === 'get') context.gameData = await db.getUserGameData(data);
        
        try {
            if (!context.gameData && data.user && data.method === 'get') {
                context.gameData = {};
                context.gameData.username = await db.getUsername(data.user);
            };
        }
        catch(err) { console.log(err); gameData = null };

        return callback(200, nunjucks.render('profile.njk', context));
    },
    leaderboard: async (res, data, callback) => {
        const context = { active: 'leaderboard', user: data.user, topGames: [], topUsers: [] };
        context.topGames = await (await db.getTopGames()).map(game => game.games); 
        context.topUsers = await db.getTopUsers();
        console.log(context.topGames)
        return callback(200, nunjucks.render('leaderboard.njk', context))
    },
    logout: (res, data, callback) => {
        res.setHeader('Set-Cookie', `_id=${data.user}; expires=${middleware.expireCookie()}; HttpOnly`);
        return callback(302, { location: '/profile' });
    },
    notfound: (res, data, callback) => callback(404, nunjucks.render('404.njk')),
};