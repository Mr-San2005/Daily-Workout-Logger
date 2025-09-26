import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { workoutAPI } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWorkout, setEditingWorkout] = useState(null);

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

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutAPI.deleteWorkout(workoutId);
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout({ ...workout });
  };

  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    try {
      await workoutAPI.updateWorkout(editingWorkout._id, editingWorkout);
      setEditingWorkout(null);
      fetchWorkouts();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = editingWorkout.exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setEditingWorkout({ ...editingWorkout, exercises: updatedExercises });
  };

  // Prepare chart data
  const chartData = {
    labels: workouts.slice(-10).map(workout => 
      new Date(workout.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Total Exercises per Workout',
        data: workouts.slice(-10).map(workout => workout.exercises.length),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workout Progress (Last 10 Sessions)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Workout History</h1>
        
        {/* Chart */}
        {workouts.length > 0 && (
          <div className="mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Edit Form Modal */}
        {editingWorkout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Edit Workout</h3>
              <form onSubmit={handleUpdateWorkout} className="space-y-4">
                <div className="space-y-3">
                  {editingWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 p-4 border rounded-lg">
                      <input
                        type="text"
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Weight"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Duration"
                        value={exercise.duration}
                        onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <textarea
                    value={editingWorkout.notes}
                    onChange={(e) => setEditingWorkout({ ...editingWorkout, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Notes..."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    Update Workout
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingWorkout(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Workout List */}
        {workouts.length === 0 ? (
          <p className="text-center text-gray-600">No workouts found. Start logging your workouts!</p>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {new Date(workout.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(workout.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditWorkout(workout)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">{exercise.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Sets: {exercise.sets}</p>
                        <p>Reps: {exercise.reps}</p>
                        {exercise.weight > 0 && <p>Weight: {exercise.weight} kg</p>}
                        {exercise.duration > 0 && <p>Duration: {exercise.duration} min</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {workout.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 italic">"{workout.notes}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;