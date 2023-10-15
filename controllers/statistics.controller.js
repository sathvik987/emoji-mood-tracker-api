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

const getMoodTrends = async (req, res, next) => {
    try {
        // Get mood trends data
        const moodTrends = await Mood.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }, // Sort by date in ascending order
        ]);

        // Extract dates and mood counts from the result
        const dates = moodTrends.map((trend) => trend._id);
        const moodCounts = moodTrends.map((trend) => trend.count);

        res.json({ dates, moodCounts });
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const getPublicMoodBoardData = async (req, res, next) => {
    try {
        const moodData = await Mood.find();

        const formattedData = moodData.map((entry) => ({
            emoji: entry.emoji,
            note: entry.note,
            timestamp: entry.timestamp,
        }));

        res.json(formattedData);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};


module.exports = {
    getEmojiStatistics,
    getMoodTrends,
    getPublicMoodBoardData
};