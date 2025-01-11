//activity-calendar/models/activity.js

const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Hard', 'Easy', 'Creative', 'Routine'],
  }
});

const activityEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    activities: {
      morning: {
        activityName: {
          type: String,
          enum: ['Morning hygiene', 'Breakfast', 'Leave to work', 'Work from home', ''],
         
        },
        activityTypes: [activityTypeSchema] // Embeds activity types schema as an array
      },
      afternoon: {
        activityName: {
          type: String,
          enum: ['Lunchbreak', 'Finish workload', 'Return home', 'Go groceries', ''],
        
        },
        activityTypes: [activityTypeSchema] 
      },
      evening: {
        activityName: {
          type: String,
          enum: ['Family Time', 'Go for walk', 'Exercise', 'Help the community', ''],
        
        },
        activityTypes: [activityTypeSchema] 
      },
      night: {
        activityName: {
          type: String,
          enum: ['Prepare for the morning', 'Read a book', 'Go for clubbing', 'Meditate', ''],
          
        },
        activityTypes: [activityTypeSchema] 
      }
    }
});

const ActivityEntry = mongoose.model('ActivityEntry', activityEntrySchema);
const ActivityType = mongoose.model('ActivityType', activityTypeSchema);

module.exports = { ActivityEntry, ActivityType };