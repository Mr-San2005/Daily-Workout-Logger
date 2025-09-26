import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../../services/api';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    exercises: [{ name: '', sets: '', reps: '', weight: '', duration: '' }],
    notes: ''
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutAPI.getWorkouts();
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { name: '', sets: '', reps: '', weight: '', duration: '' }]
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = newWorkout.exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const handleRemoveExercise = (index) => {
    const updatedExercises = newWorkout.exercises.filter((_, i) => i !== index);
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    try {
      const workoutData = {
        ...newWorkout,
        exercises: newWorkout.exercises.filter(ex => ex.name.trim() !== '')
      };
      
      await workoutAPI.addWorkout(workoutData);
      setNewWorkout({
        exercises: [{ name: '', sets: '', reps: '', weight: '', duration: '' }],
        notes: ''
      });
      setShowAddForm(false);
      fetchWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const todaysWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date).toDateString();
    const today = new Date().toDateString();
    return workoutDate === today;
  });

  const totalWorkouts = workouts.length;
  const thisWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user.username}! 💪
        </h1>
        <p className="text-gray-600">Ready for another great workout?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Workouts</h3>
          <p className="text-3xl font-bold">{totalWorkouts}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">This Week</h3>
          <p className="text-3xl font-bold">{thisWeekWorkouts}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Today</h3>
          <p className="text-3xl font-bold">{todaysWorkouts.length}</p>
        </div>
      </div>

      {/* Quick Add Workout */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Quick Add Workout</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Workout'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmitWorkout} className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Exercises</h3>
              {newWorkout.exercises.map((exercise, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-4 border rounded-lg">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Sets"
                    value={exercise.sets}
                    onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={exercise.weight}
                    onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.5"
                  />
                  <input
                    type="number"
                    placeholder="Duration (min)"
                    value={exercise.duration}
                    onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                    disabled={newWorkout.exercises.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddExercise}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                Add Exercise
              </button>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Notes (optional)
              </label>
              <textarea
                value={newWorkout.notes}
                onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Any notes about your workout..."
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              Save Workout
            </button>
          </form>
        )}
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Summary</h2>
        {todaysWorkouts.length > 0 ? (
          <div className="space-y-4">
            {todaysWorkouts.map((workout) => (
              <div key={workout._id} className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(workout.date).toLocaleTimeString()}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-semibold">{exercise.name}</p>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && ` @ ${exercise.weight}kg`}
                        {exercise.duration && ` (${exercise.duration} min)`}
                      </p>
                    </div>
                  ))}
                </div>
                {workout.notes && (
                  <p className="text-sm text-gray-600 mt-2 italic">{workout.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No workouts logged today. Time to get moving! 🏃‍♂️</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;