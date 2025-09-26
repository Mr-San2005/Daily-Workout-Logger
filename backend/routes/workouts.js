const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all workouts for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Server error while fetching workouts' });
  }
});

// Add new workout
router.post('/', auth, async (req, res) => {
  try {
    const { exercises, date, notes } = req.body;

    const workout = new Workout({
      userId: req.user._id,
      exercises,
      date: date || new Date(),
      notes
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Add workout error:', error);
    res.status(500).json({ message: 'Server error while adding workout' });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { exercises, date, notes } = req.body;

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { exercises, date, notes },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ message: 'Server error while updating workout' });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ message: 'Server error while deleting workout' });
  }
});

module.exports = router;