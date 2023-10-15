const Mood = require('../models/mood.model');
const { jsonErrorHandler } = require('./helper.util');
const emojiRegex = require('emoji-regex');


const containsOnlyEmoji = (text) => {
    const characters = [...text];

    const emojiPattern = emojiRegex();

    for (const character of characters) {
        if (!emojiPattern.test(character)) {
            return false;
        }
    }

    return true;
};
const add = async (req, res, next) => {
    try {
        const user = req.user;
        let { emoji, note } = req.body;
        if (!emoji || !note) {
            return res.status(400).json('Missing required field(s). Please provide all required data.');
        }

        if (!containsOnlyEmoji(emoji)) {
            return res.status(400).json('Invalid emoji, it should consist of only one valid emoji character.');
        }

        let mood = new Mood({
            ...req.body,
            userId: user._id
        });
        mood = await mood.save();

        return res.json(mood);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const update = async (req, res, next) => {
    try {
        const user = req.user;
        let { emoji, note } = req.body;
        if (!emoji && !note) {
            return res.status(400).json('Missing required field(s). Please provide all required data.');
        }

        if (emoji) {
            if (!containsOnlyEmoji(emoji)) {
                return res.status(400).json('Invalid emoji, it should consist of only one valid emoji character.');
            }
        }

        if (!req.params.id) {
            return res.status(400).json('Missing required field(s). Please provide all required data.');
        }

        let mood = await Mood.findOne({ "_id": req.params.id, userId: user._id });
        if (!mood) {
            return res.status(400).json("Invalid id, or you don't have access to modify this.");
        }

        if (emoji) {
            mood.emoji = emoji;
        }

        if (note) {
            mood.note = note;
        }

        mode = await mood.save();
        return res.json(mood);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const deleteMood = async (req, res, next) => {
    try {
        const user = req.user;
        if (!req.params.id) {
            return res.status(400).json('Missing required field(s). Please provide all required data.');
        }

        let mood = await Mood.findOne({ "_id": req.params.id, userId: user._id });
        if (!mood) {
            return res.status(400).json("Invalid id, or you don't have access to modify this.");
        }

        await Mood.deleteOne({ _id: req.params.id });
        return res.json('Mood entry deleted successfully.');
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const getMonthlySummary = async (req, res, next) => {
    try {
        const userId = req.user._id;

        if (!req.query.month || !req.query.year) {
            return res.status(400).json('Missing required query field(s). Please provide all required data.');
        }

        const month = Number(req.query.month);
        const year = Number(req.query.year);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const monthlyMoods = await Mood.find({
            userId,
            timestamp: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        const emojiSummary = {};
        const noteSummary = [];

        monthlyMoods.forEach((mood) => {
            if (emojiSummary[mood.emoji]) {
                emojiSummary[mood.emoji]++;
            } else {
                emojiSummary[mood.emoji] = 1;
            }
            noteSummary.push(mood.note);
        });

        return res.json({
            emojiSummary,
            noteSummary,
            monthlyMoods,
        });
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};

const getByFilter = async (req, res, next) => {
    try {
        const userId = req.user._id;
        let query = { userId };
        let order = -1;
        if (req.query.chronologicalOrder === "true") {
            order = 1;
        }

        if (req.query.startDate || req.query.endDate) {
            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);

            if ((!startDate instanceof Date || isNaN(startDate)) || (!endDate instanceof Date || isNaN(endDate))) {
                return res.status(400).json('Invalid date range.');
            }
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            query.timestamp = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        const data = await Mood.find(query).sort({ timestamp: order });
        return res.json(data);
    } catch (error) {
        return jsonErrorHandler(req, res, next, error);
    }
};



module.exports = {
    add,
    update,
    deleteMood,
    getMonthlySummary,
    getByFilter
};