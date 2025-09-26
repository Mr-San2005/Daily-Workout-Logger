const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Predefined workout plans
const workoutPlans = {
  strength: {
    goal: "strength",
    description: "Focus on building maximum strength with heavy weights and low reps",
    exercises: [
      { name: "Bench Press", sets: 5, reps: 5, weight: "80-90% 1RM" },
      { name: "Deadlift", sets: 5, reps: 5, weight: "80-90% 1RM" },
      { name: "Squat", sets: 5, reps: 5, weight: "80-90% 1RM" },
      { name: "Overhead Press", sets: 4, reps: 6, weight: "75-85% 1RM" },
      { name: "Barbell Row", sets: 4, reps: 6, weight: "75-85% 1RM" }
    ]
  },
  endurance: {
    goal: "endurance",
    description: "Build muscular endurance with higher reps and moderate weight",
    exercises: [
      { name: "Push-ups", sets: 4, reps: 20, weight: "Bodyweight" },
      { name: "Air Squats", sets: 4, reps: 25, weight: "Bodyweight" },
      { name: "Mountain Climbers", sets: 4, reps: 30, weight: "Bodyweight" },
      { name: "Plank", sets: 3, reps: "60 seconds", weight: "Bodyweight" },
      { name: "Burpees", sets: 3, reps: 15, weight: "Bodyweight" },
      { name: "Jumping Jacks", sets: 3, reps: 40, weight: "Bodyweight" }
    ]
  },
  "fat loss": {
    goal: "fat loss",
    description: "High-Intensity Interval Training (HIIT) for maximum calorie burn",
    exercises: [
      { name: "Burpees", sets: 4, reps: 12, weight: "Bodyweight" },
      { name: "Jump Squats", sets: 4, reps: 15, weight: "Bodyweight" },
      { name: "High Knees", sets: 4, reps: "30 seconds", weight: "Bodyweight" },
      { name: "Russian Twists", sets: 4, reps: 25, weight: "Bodyweight" },
      { name: "Sprint Intervals", sets: 6, reps: "30 sec on/30 sec off", weight: "Bodyweight" },
      { name: "Battle Ropes", sets: 4, reps: "45 seconds", weight: "Heavy rope" }
    ]
  },
  aesthetics: {
    goal: "aesthetics",
    description: "Balanced hypertrophy training for muscle growth and definition",
    exercises: [
      { name: "Incline Dumbbell Press", sets: 4, reps: 10, weight: "70-80% 1RM" },
      { name: "Pull-ups", sets: 4, reps: 8, weight: "Bodyweight + weight" },
      { name: "Dumbbell Shoulder Press", sets: 4, reps: 12, weight: "65-75% 1RM" },
      { name: "Leg Press", sets: 4, reps: 12, weight: "70-80% 1RM" },
      { name: "Dumbbell Curls", sets: 3, reps: 12, weight: "65-75% 1RM" },
      { name: "Tricep Dips", sets: 3, reps: 10, weight: "Bodyweight + weight" }
    ]
  },
  general: {
    goal: "general fitness",
    description: "Well-rounded workout for overall fitness and health",
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: 12, weight: "Moderate" },
      { name: "Push-ups", sets: 3, reps: 10, weight: "Bodyweight" },
      { name: "Dumbbell Rows", sets: 3, reps: 12, weight: "Moderate" },
      { name: "Plank", sets: 3, reps: "45 seconds", weight: "Bodyweight" },
      { name: "Lunges", sets: 3, reps: 10, weight: "Bodyweight" },
      { name: "Bicycle Crunches", sets: 3, reps: 15, weight: "Bodyweight" }
    ]
  }
};

// Simple keyword detection function
function detectGoal(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('strength') || lowerMessage.includes('strong') || 
      lowerMessage.includes('power') || lowerMessage.includes('heavy')) {
    return 'strength';
  }
  
  if (lowerMessage.includes('endurance') || lowerMessage.includes('cardio') || 
      lowerMessage.includes('stamina') || lowerMessage.includes('running')) {
    return 'endurance';
  }
  
  if (lowerMessage.includes('fat loss') || lowerMessage.includes('weight loss') || 
      lowerMessage.includes('burn fat') || lowerMessage.includes('hiit') ||
      lowerMessage.includes('lose weight')) {
    return 'fat loss';
  }
  
  if (lowerMessage.includes('aesthetics') || lowerMessage.includes('muscle') || 
      lowerMessage.includes('physique') || lowerMessage.includes('bodybuilding') ||
      lowerMessage.includes('hypertrophy')) {
    return 'aesthetics';
  }
  
  return 'general';
}

// Chat with fitness bot
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const detectedGoal = detectGoal(message);
    const workoutPlan = workoutPlans[detectedGoal];
    
    const response = {
      message: `Based on your message, I've detected you're interested in **${workoutPlan.goal}** training. Here's a workout plan for you:`,
      plan: workoutPlan,
      additionalTips: getAdditionalTips(detectedGoal)
    };
    
    res.json(response);
  } catch (error) {
    console.error('Bot error:', error);
    res.status(500).json({ message: 'Server error while processing your request' });
  }
});

// Get additional tips based on goal
function getAdditionalTips(goal) {
  const tips = {
    strength: [
      "Rest 3-5 minutes between sets for full recovery",
      "Focus on progressive overload - gradually increase weight",
      "Ensure proper form to prevent injury"
    ],
    endurance: [
      "Keep rest periods short (30-60 seconds)",
      "Focus on consistent pace and breathing",
      "Gradually increase workout duration"
    ],
    "fat loss": [
      "Maintain high intensity throughout the workout",
      "Combine with a caloric deficit for best results",
      "Stay hydrated and listen to your body"
    ],
    aesthetics: [
      "Focus on mind-muscle connection",
      "Rest 60-90 seconds between sets",
      "Include both compound and isolation exercises"
    ],
    general: [
      "Consistency is key - aim for 3-4 workouts per week",
      "Listen to your body and rest when needed",
      "Progress gradually to avoid injury"
    ]
  };
  
  return tips[goal] || tips.general;
}

module.exports = router;