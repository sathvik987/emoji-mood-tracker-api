const Mood = require('../models/mood.model');
const { jsonErrorHandler } = require('./helper.util');

const getEmojiStatistics = async (req, res, next) => {
    try {
        const emojiStatisticsData = await Mood.aggregate([
            {
                $group: {
                    _id: '$emoji',
                    count: { $sum: 1 }, // Count occurrences of each emoji
                },
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    emoji: '$_id', // Rename _id to emoji
                    count: 1, // Include the count field
                },
            },
        ]).exec();

        return res.json(emojiStatisticsData);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

module.exports = {
    getEmojiStatistics
};