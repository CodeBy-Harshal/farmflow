import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Camera, FileText } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI agricultural assistant. I can help you with crop management, pest control, soil analysis, market prices, and farming best practices. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      'weather': 'Based on current meteorological data, expect partly cloudy conditions with temperatures ranging from 24-32°C. Light rainfall is predicted in 2-3 days, which would be beneficial for your crops. I recommend checking soil moisture levels and adjusting irrigation accordingly.',
      'crop': 'For optimal crop health, I recommend: 1) Regular soil testing every 2-3 months 2) Implementing drip irrigation for water efficiency 3) Using organic fertilizers during the growing season 4) Monitoring for common pests like aphids and bollworms. Would you like specific advice for any particular crop?',
      'price': 'Current market analysis shows: Wheat prices are trending upward (+12% this month), Rice demand is stable, Vegetables are showing seasonal variations. I recommend selling wheat within the next 2 weeks to maximize profits. Would you like detailed price forecasts for specific crops?',
      'soil': 'For soil health improvement: 1) Test pH levels (optimal range 6.0-7.0) 2) Add organic matter through compost 3) Practice crop rotation 4) Use cover crops during off-season 5) Monitor nutrient levels (NPK). I can provide specific recommendations based on your soil test results.',
      'default': 'I understand you\'re looking for agricultural guidance. I can help with crop management, weather planning, market analysis, soil health, pest control, and sustainable farming practices. Could you please provide more specific details about what you\'d like to know?'
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) return responses.weather;
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) return responses.crop;
    if (lowerMessage.includes('price') || lowerMessage.includes('market')) return responses.price;
    if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer')) return responses.soil;
    return responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const aiResponse = await simulateAIResponse(inputMessage);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    'What\'s the weather forecast for this week?',
    'How can I improve my crop yield?',
    'Current market prices for wheat',
    'Soil health recommendations'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Agricultural Assistant</h1>
                <p className="text-green-100">Your intelligent farming companion</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <Bot className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about farming..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <button className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-200">
                  <Mic className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-200">
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-200">
                  <FileText className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;