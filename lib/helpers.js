const bcrypt = require('bcrypt');

module.exports = {
    hashPassword: async password => {
        return await bcrypt.hash(password, 3);
    },
    comparePassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
    },
};