const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  },
  weight: {
    type: Number,
    default: 0,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    default: 0,
    min: 0
  }
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [exerciseSchema],
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);