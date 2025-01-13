//backend activity-calendar// controllers/activities.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js'); // For protected routes
const Activity = require('../models/activity.js'); // Import the Activity model
const router = express.Router();

// ========== Public Routes ===========

// GET all activity entries
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate('author') // Populate author field with user details
      .sort({ createdAt: 'desc' });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========= Protected Routes =========
router.use(verifyToken); // Apply middleware for protected routes

// POST /activities — Create a new activity entry
router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id;
    req.body.activities = req.body.activities || {
      morning: { activityTypes: [] },
      afternoon: { activityTypes: [] },
      evening: { activityTypes: [] },
      night: { activityTypes: [] },
    };

    const activityEntry = await Activity.create(req.body);
    activityEntry._doc.author = req.user; // Include author details in the response
    res.status(201).json(activityEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});



// GET /activities/:activityId — Get a specific activity entry
router.get('/:activityId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId)
      .populate('author')
      .populate('activities.morning.activityTypes.author')
      .populate('activities.afternoon.activityTypes.author')
      .populate('activities.evening.activityTypes.author')
      .populate('activities.night.activityTypes.author');
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json(error);
  }
});

// PUT /activities/:activityId — Update an activity entry
router.put('/:activityId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);

    if (!activity.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const defaultActivities = {
      morning: req.body.activities?.morning || { activityTypes: [] },
      afternoon: req.body.activities?.afternoon || { activityTypes: [] },
      evening: req.body.activities?.evening || { activityTypes: [] },
      night: req.body.activities?.night || { activityTypes: [] },
    };

    const updatedData = { ...req.body, activities: defaultActivities };

    const updatedActivity = await Activity.findByIdAndUpdate(req.params.activityId, updatedData, {
      new: true,
    }).populate('author');

    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json(error);
  }
});


// DELETE /activities/:activityId — Delete an activity entry
router.delete('/:activityId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);

    if (!activity.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedActivity = await Activity.findByIdAndDelete(req.params.activityId);
    res.status(200).json(deletedActivity);
  } catch (error) {
    res.status(500).json(error);
  }
});

// POST /activities/:activityId/types — Add a new activity type to a specific time
router.post('/:activityId/types', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const { timeOfDay, activityType } = req.body; 
    const activity = await Activity.findById(req.params.activityId);

    if (!['morning', 'afternoon', 'evening', 'night'].includes(timeOfDay)) {
      return res.status(400).json({ error: 'Invalid time of day' });
    }

    activity.activities[timeOfDay].activityTypes.push(activityType);
    await activity.save();

    res.status(201).json(activity.activities[timeOfDay]);
  } catch (error) {
    res.status(500).json(error);
  }
});

// PUT /activities/:activityId/types/:typeId — Update an existing activity type
router.put('/:activityId/types/:typeId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    const { timeOfDay, updatedType } = req.body;

    const activityType = activity.activities[timeOfDay].activityTypes.id(req.params.typeId);
    activityType.type = updatedType.type;

    await activity.save();

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE /activities/:activityId/types/:typeId — Delete an activity type
router.delete('/:activityId/types/:typeId', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    const { timeOfDay } = req.body;

    activity.activities[timeOfDay].activityTypes.id(req.params.typeId).remove();
    await activity.save();

    res.status(200).json({ message: 'Activity type removed successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

