//activity-calendarback-end/server.js

const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const activitiesRouter = require('./controllers/activities');

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
  
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });

// Routes go here
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/activities', activitiesRouter);

app.listen(3000, () => {
    console.log('The express app is ready!');
});