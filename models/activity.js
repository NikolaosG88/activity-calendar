//activity-calendar/models/activity.js

const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Hard', 'Easy', 'Creative', 'Detrimental'],
    required: true
  }
});

const activityEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    activities: {
      morning: {
        activityName: {
          type: String,
          enum: ['Morning hygiene', 'Breakfast', 'Leave to work', 'Work from home', ''], // Predefined options + custom
          required: true
        },
        activityTypes: [activityTypeSchema] // Embeds activity types schema as an array
      },
      afternoon: {
        activityName: {
          type: String,
          enum: ['Lunchbreak', 'Finish workload', 'Returnhome', 'Go groceries', ''],
          required: true
        },
        activityTypes: [activityTypeSchema] 
      },
      evening: {
        activityName: {
          type: String,
          enum: ['Family Time', 'Go for walk', 'Exercise', 'Help the community', ''],
          required: true
        },
        activityTypes: [activityTypeSchema] 
      },
      night: {
        activityName: {
          type: String,
          enum: ['Prepare for the morning', 'Read a book', 'Go for clubbing', 'Meditate', ''],
          required: true
        },
        activityTypes: [activityTypeSchema] 
      }
    }
  }, { timestamps: true });

  const ActivityEntry = mongoose.model('ActivityEntry', activityEntrySchema);
  const ActivityType = mongoose.model('ActivityType', activityTypeSchema);

module.exports = { ActivityEntry, ActivityType };