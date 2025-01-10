// controllers/activities.js
const express = require('express');
const router = express.Router();
const { ActivityEntry } = require('../models/activity');
const verifyToken = require('../middleware/verify-token');

// Create a new activity entry
router.post('/activities', verifyToken, async (req, res) => {
    try {
        const newActivityEntry = await ActivityEntry.create({
            user: req.user._id,
            date: req.body.date,
            activities: req.body.activities
        });
        res.status(201).json(newActivityEntry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all activity entries
router.get('/activities', verifyToken, async (req, res) => {
    try {
        const activityEntries = await ActivityEntry.find({ user: req.user._id });
        res.status(200).json(activityEntries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific activity entry
router.get('/activities/:id', verifyToken, async (req, res) => {
    try {
        const activityEntry = await ActivityEntry.findOne({ _id: req.params.id, user: req.user._id });
        if (!activityEntry) {
            return res.status(404).json({ error: 'Activity entry not found.' });
        }
        res.status(200).json(activityEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an existing activity entry
router.put('/activities/:id', verifyToken, async (req, res) => {
    try {
        const updatedActivityEntry = await ActivityEntry.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedActivityEntry) {
            return res.status(404).json({ error: 'Activity entry not found.' });
        }
        res.status(200).json(updatedActivityEntry);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an activity entry
router.delete('/activities/:id', verifyToken, async (req, res) => {
    try {
        const deletedActivityEntry = await ActivityEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!deletedActivityEntry) {
            return res.status(404).json({ error: 'Activity entry not found.' });
        }
        res.status(200).json({ message: 'Activity entry deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
