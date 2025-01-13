//activity-calendar-back-end/models/activity.js

const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "",
    trim: true
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
{ timestamps: true }
);

const activityEntrySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activities: {
      morning: {
        activityName: { type: String, default: "No activity logged", trim: true },
        activityTypes: { type: [activityTypeSchema], default: [] },
      },
      afternoon: {
        activityName: { type: String, default: "No activity logged", trim: true },
        activityTypes: { type: [activityTypeSchema], default: [] },
      },
      evening: {
        activityName: { type: String, default: "No activity logged", trim: true },
        activityTypes: { type: [activityTypeSchema], default: [] },
      },
      night: {
        activityName: { type: String, default: "No activity logged", trim: true },
        activityTypes: { type: [activityTypeSchema], default: [] },
      },
    },
  },
  { timestamps: true }
);


const Activity = mongoose.model('Activity', activityEntrySchema);

module.exports = Activity;