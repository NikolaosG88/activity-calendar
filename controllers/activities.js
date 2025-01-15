//backend activity-calendar// controllers/activities.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Activity = require('../models/activity.js');
const router = express.Router();

// ========== Public Routes ===========
router.get('/', async (req, res) => {
    try {
      const activities = await Activity.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json(error);
    }
});

// ========= Protected Routes =========
router.use(verifyToken);

// POST activity (full URL: POST /activities)
router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id;
      console.log(req.body);
      req.body.morning.activityType= {
        activityType: req.body.morning.activityType,
        author: req.user._id,
      }
      req.body.afternoon.activityType= {
        activityType: req.body.afternoon.activityType,
        author: req.user._id,
      }
      req.body.evening.activityType= {
        activityType: req.body.evening.activityType,
        author: req.user._id,
      }
      req.body.night.activityType= {
        activityType: req.body.night.activityType,
        author: req.user._id,
      }
      console.log(req.body);
      const activity = await Activity.create(req.body);
      activity._doc.author = req.user;
      res.status(201).json(activity);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
});

// POST new activity type (full URL: POST /activities/:activityId/types)
// router.post('/:activityId/types', async (req, res) => {
//     try {
//       req.body.author = req.user._id;
//       const activity = await Activity.findById(req.params.activityId);
//       activity.activityTypes.push(req.body);
//       await activity.save();

//       const newActivityType = activity.activityTypes[activity.activityTypes.length - 1];
//       newActivityType._doc.author = req.user;

//       res.status(201).json(newActivityType);
//     } catch (error) {
//       res.status(500).json(error);
//     }
// });

// GET single activity by ID (full URL: GET /activities/:activityId)
router.get('/:activityId', async (req, res) => {
    try {
      const activity = await Activity.findById(req.params.activityId).populate('author').populate('activityTypes.author');
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json(error);
    }
});

// PUT update activity (full URL: PUT /activities/:activityId)
router.put('/:activityId', async (req, res) => {
    try {
      const activity = await Activity.findById(req.params.activityId);

      if (!activity.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }

      const updatedActivity = await Activity.findByIdAndUpdate(
        req.params.activityId,
        req.body,
        { new: true }
      );

      updatedActivity._doc.author = req.user;

      res.status(200).json(updatedActivity);
    } catch (error) {
      res.status(500).json(error);
    }
});

// DELETE activity (full URL: DELETE /activities/:activityId)
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

// PUT update activity type (full URL: PUT /activities/:activityId/types/:typeId)
router.put('/:activityId/types/:typeId', async (req, res) => {
    try {
      const activity = await Activity.findById(req.params.activityId);
      const type = activity.activityTypes.id(req.params.typeId);
      type.type = req.body.type;
      await activity.save();
      const updatedActivity = await Activity.findById(req.params.activityId).populate('author').populate('activityTypes.author');
      res.status(200).json(updatedActivity);
    } catch (err) {
      res.status(500).json(err);
    }
});

// DELETE activity type (full URL: DELETE /activities/:activityId/types/:typeId)
router.delete('/:activityId/types/:typeId', async (req, res) => {
    try {
      const activity = await Activity.findById(req.params.activityId);
      activity.activityTypes.remove({ _id: req.params.typeId });
      await activity.save();
      res.status(200).json({ message: 'Ok' });
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
