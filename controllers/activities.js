// controllers/activities.js

const express = require('express');
const router = express.Router();
const { ActivityEntry } = require('../models/activity');
const verifyToken = require('../middleware/verify-token');

// ========= Public Routes ===========
// Get all public activity entries (for testing)
router.get('/', async (req, res) => {
  try {
    const activities = await ActivityEntry.find({})
      .populate('user')
      .sort({ createdAt: 'desc' });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========= Protected Routes =========
router.use(verifyToken);

// POST /activities
router.post('/', async (req, res) => {
  try {
    req.body.user = req.user._id;  // Associate activity with the logged-in user
    const newActivityEntry = await ActivityEntry.create(req.body);
    newActivityEntry._doc.user = req.user;  // Populate the user data for response
    res.status(201).json(newActivityEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// GET /activities/:activityId
router.get('/:activityId', async (req, res) => {
  try {
    const activityEntry = await ActivityEntry.findById(req.params.activityId).populate('user');
    if (!activityEntry) {
      return res.status(404).json({ error: 'Activity entry not found.' });
    }
    res.status(200).json(activityEntry);
  } catch (error) {
    res.status(500).json(error);
  }
});

// PUT /activities/:activityId
router.put('/:activityId', async (req, res) => {
  try {
    const activityEntry = await ActivityEntry.findById(req.params.activityId);
    if (!activityEntry || !activityEntry.user.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const updatedActivityEntry = await ActivityEntry.findByIdAndUpdate(
      req.params.activityId,
      req.body,
      { new: true, runValidators: true }
    ).populate('user');

    res.status(200).json(updatedActivityEntry);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE /activities/:activityId
router.delete('/:activityId', async (req, res) => {
  try {
    const activityEntry = await ActivityEntry.findById(req.params.activityId);
    if (!activityEntry || !activityEntry.user.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedActivityEntry = await ActivityEntry.findByIdAndDelete(req.params.activityId);
    res.status(200).json(deletedActivityEntry);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
