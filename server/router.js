const pages = require('../routes/pages');
const api = require('../routes/api');

module.exports = {
    '': pages.game,
    about: pages.about,
    profile: pages.profile,
    logout: pages.logout,
    leaderboard: pages.leaderboard,
    notfound: pages.notfound,
    'api/saveScore': api.saveScore,
};