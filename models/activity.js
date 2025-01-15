//activity-calendar-back-end/models/activity.js

const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
  activityType: {
    type: String,
    default: "",
    required: true,
    trim: true
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
{ timestamps: true }
);

const activitySchema = new mongoose.Schema(
    {
      morning: {
        activityName: String,
        activityType: activityTypeSchema,
      },
      afternoon: {
        activityName: String,
        activityType: activityTypeSchema,
      },
      evening: {
        activityName: String,
        activityType: activityTypeSchema,
      },
      night: {
        activityName: String,
        activityType: activityTypeSchema,
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;