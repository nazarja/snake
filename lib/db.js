const { MongoClient, ObjectId } = require('mongodb');

const mongo = new MongoClient(process.env.MONGO_URI);

const users = mongo.db("snake").collection("users");
const games = mongo.db("snake").collection("games");

const db = {
    createUser: async data => {
        const user = await users.insertOne(data);
        return user.insertedId;
    },
    getUser: async username => {
        return await users.findOne({ username });
    },
    getUserById: async userId => {
        return await users.findOne({ _id: ObjectId(userId) });
    },
    getUsername: async userId => {
        const user = await users.findOne({ _id: ObjectId(userId) });
        return user?.username;
    },
    saveScore: async data => {
        const gameData = await games.findOne({ user_id: ObjectId(data.user) });

        if (gameData) {
            data.payload.username = gameData.username;
            await games.updateOne(
                { user_id: ObjectId(data.user) },
                { $set: { totalScore: gameData.totalScore + data.payload.finalScore } },
            );
            await games.updateOne(
                { user_id: ObjectId(data.user) },
                { $push: { games: data.payload } }
            );
        }
        else {
            const user = await users.findOne({ _id: ObjectId(data.user) });
            data.payload.username = user.username;
            const gameDataObj = {
                user_id: user._id,
                username: user.username,
                totalScore: data.payload.finalScore,
                games: [
                    data.payload
                ]
            };
            await games.insertOne(gameDataObj);
        };
    },
    getUserGameData: async data => {
        const gameData = await games.findOne({ user_id: ObjectId(data.user) });
        if (gameData) return gameData;
        return null;
    },
    getTopGames: async () => {
        const query = await games.aggregate([
            { $project: { 'games': 1 } },
            { $unwind: "$games" },
            { $sort: { 'games.finalScore': -1 } },
            { $limit: 5 }
        ]);
        return await query.toArray();
    },
    getTopUsers: async () => {
        const query = await games.aggregate([{ $sort: { totalScore: -1 } }]).limit(5);
        return await query.toArray();
    }
};

module.exports = { mongo, db };
