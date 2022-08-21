const nunjucks = require('nunjucks');
const moment = require('moment');

const config = () => {
    const njk = nunjucks.configure('views', { autoescape: true });

    njk.addFilter('parseDate', async (value, callback) => {
        await callback(null, moment(value).format('Do MMM YYYY, h:mma'));
    }, true);
};

module.exports = { config };
