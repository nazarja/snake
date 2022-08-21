const { db } = require('../lib/db');

module.exports = {
    saveScore: (res, data, callback) => {
        if (data.user) {
            data.payload.date = new Date();
            data.payload.user_id = data.user;
            db.saveScore(data);
            return callback(201, {status: 201});
        }
        return callback(204, {status: 204});
    }
};
