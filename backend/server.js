const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const botRoutes = require('./routes/bot');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Local)
mongoose.connect('mongodb://127.0.0.1:27017/workoutLogger', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/workouts', workoutRoutes);
app.use('/bot', botRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Workout Logger API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});