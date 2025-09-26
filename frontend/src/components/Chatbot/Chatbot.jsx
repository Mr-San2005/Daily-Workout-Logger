import React, { useState, useRef, useEffect } from 'react';
import { botAPI } from '../../services/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your fitness bot. Tell me about your fitness goals and I'll suggest a workout plan for you. You can ask about strength training, endurance, fat loss, aesthetics, or general fitness!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await botAPI.chat(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: response.data.message,
        isBot: true,
        timestamp: new Date(),
        plan: response.data.plan,
        tips: response.data.additionalTips
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble processing your request. Please try again.",
        isBot: true,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageText = (text) => {
    // Simple markdown-style formatting for bold text
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md h-96">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold flex items-center">
            🤖 Fitness Bot
            <span className="ml-2 text-sm font-normal opacity-75">Your AI Workout Assistant</span>
          </h1>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.isBot
                    ? message.isError
                      ? 'bg-red-100 text-red-800'
                      : 'bg-white text-gray-800 shadow-md'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {/* Message Text */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(message.text)
                  }}
                  className="text-sm"
                />

                {/* Workout Plan */}
                {message.plan && (
                  <div className="mt-4 space-y-3">
                    <div className="border-t pt-3">
                      <h4 className="font-bold text-lg mb-2 text-blue-800">
                        🎯 {message.plan.goal.toUpperCase()} PLAN
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {message.plan.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm">Exercises:</h5>
                        {message.plan.exercises.map((exercise, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-sm">{exercise.name}</span>
                              <span className="text-xs text-gray-500">
                                {exercise.sets} sets × {exercise.reps} reps
                              </span>
                            </div>
                            {exercise.weight && (
                              <div className="text-xs text-gray-600 mt-1">
                                Weight: {exercise.weight}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    {message.tips && (
                      <div className="border-t pt-3">
                        <h5 className="font-semibold text-sm mb-2">💡 Pro Tips:</h5>
                        <ul className="text-xs space-y-1">
                          {message.tips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs opacity-75 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-md px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Bot is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t p-4 bg-white rounded-b-lg">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about strength, endurance, fat loss, aesthetics, or general fitness..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['Strength training', 'Fat loss', 'Endurance', 'Aesthetics', 'General fitness'].map((topic) => (
              <button
                key={topic}
                onClick={() => setInputMessage(`I want to focus on ${topic.toLowerCase()}`)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                disabled={loading}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;