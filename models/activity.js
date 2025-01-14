//activity-calendar-back-end/models/activity.js

const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
  type: {
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
        type: String,
        required: true,
      },
      afternoon: {
        type: String,
        required: true,
      },
      evening: {
        type: String,
        required: true,
      },
      night: {
        type: String,
        required: true,
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      activityTypes: [activityTypeSchema],
    },
    { timestamps: true }
);


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;