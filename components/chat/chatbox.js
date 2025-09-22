"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Paperclip, 
  Image, 
  Send, 
  Settings, 
  BarChart3, 
  Crown, 
  LogOut, 
  User, 
  ChevronDown,
  MessageSquare,
  Calendar,
  Menu,
  X,
  Zap
} from 'lucide-react';

const NoverisChatPage = ({ agent = "odin" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('mortal');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const textareaRef = useRef(null);

  const agents = [
    { 
      id: "fortuna", 
      name: "Fortuna", 
      specialty: "Market & Stock Intelligence", 
      avatar: "/asset/agent/fortuna.webp",
      greeting: "Hello! I'm Fortuna, your Market Intelligence Agent.",
      description: "I help you analyze market trends, track stock performance, and provide insights on financial opportunities. Ready to explore the markets together?",
      welcomeMessage: "Ask me about market analysis, stock trends, or any financial insights you need.",
      origin: "Roman",
      samplePrompts: [
        "What are the current market trends for tech stocks?",
        "Analyze Tesla's performance this quarter",
        "What sectors should I watch for investment opportunities?",
        "Give me insights on cryptocurrency market movements"
      ]
    },
    { 
      id: "loki", 
      name: "Loki", 
      specialty: "Influence & Reputation Intelligence", 
      avatar: "/asset/agent/loki.webp",
      greeting: "Greetings! I'm Loki, your Reputation Intelligence Agent.",
      description: "I monitor public perception, analyze brand sentiment, and help protect your reputation across all channels.",
      welcomeMessage: "Let's discuss brand monitoring, reputation management, or public sentiment analysis.",
      origin: "Norse",
      samplePrompts: [
        "How is my brand being perceived on social media?",
        "What are people saying about our latest product launch?",
        "Monitor sentiment around our company name",
        "Analyze competitor reputation in our industry"
      ]
    },
    { 
      id: "yama", 
      name: "Yama", 
      specialty: "Legal Risk & Compliance Intelligence", 
      avatar: "/asset/agent/yama.webp",
      greeting: "Welcome! I'm Yama, your Legal Intelligence Agent.",
      description: "I provide insights on legal risks, regulatory compliance, and litigation trends to keep you informed.",
      welcomeMessage: "How can I assist you with legal research, compliance matters, or risk assessment today?",
      origin: "Hindu",
      samplePrompts: [
        "What are the latest compliance requirements for fintech companies?",
        "Assess legal risks for expanding into European markets",
        "Monitor litigation trends in our industry sector",
        "Review regulatory changes affecting data privacy"
      ]
    },
    { 
      id: "vastu", 
      name: "Vastu", 
      specialty: "Real Estate & Property Intelligence", 
      avatar: "/asset/agent/vastu.webp",
      greeting: "Hello! I'm Vastu, your Real Estate Intelligence Agent.",
      description: "I analyze property trends, market valuations, and investment opportunities in real estate.",
      welcomeMessage: "Ready to explore property insights, market trends, or investment opportunities?",
      origin: "Hindu",
      samplePrompts: [
        "What are the best emerging real estate markets to invest in?",
        "Analyze property values in downtown Mumbai",
        "Show me commercial real estate trends for 2024",
        "Compare residential property prices across major cities"
      ]
    },
    { 
      id: "athena", 
      name: "Athena", 
      specialty: "Government Tender & Procurement Intelligence", 
      avatar: "/asset/agent/athena.webp",
      greeting: "Greetings! I'm Athena, your Procurement Intelligence Agent.",
      description: "I help you navigate government contracts, tender opportunities, and procurement processes.",
      welcomeMessage: "Let's discuss tender opportunities, government contracts, or procurement strategies.",
      origin: "Greek",
      samplePrompts: [
        "Find government tenders related to IT infrastructure",
        "What are the upcoming procurement opportunities in defense?",
        "Analyze winning patterns in government contracts",
        "Help me prepare a competitive tender proposal"
      ]
    },
    { 
      id: "anubis", 
      name: "Anubis", 
      specialty: "Pharma & Healthcare Intelligence", 
      avatar: "/asset/agent/anubis.webp",
      greeting: "Welcome! I'm Anubis, your Healthcare Intelligence Agent.",
      description: "I provide insights on pharmaceutical trends, clinical trials, and healthcare market dynamics.",
      welcomeMessage: "How can I help with pharmaceutical research, healthcare trends, or market analysis?",
      origin: "Egyptian",
      samplePrompts: [
        "What are the latest developments in cancer treatment research?",
        "Analyze the pharmaceutical market for diabetes medications",
        "Track clinical trial success rates for biotech companies",
        "Monitor healthcare policy changes affecting drug pricing"
      ]
    },
    { 
      id: "odin", 
      name: "Odin", 
      specialty: "Startup & Venture Intelligence", 
      avatar: "/asset/agent/odin.webp",
      greeting: "Hello! I'm Odin, your Venture Intelligence Agent.",
      description: "I track startup ecosystems, funding rounds, and emerging business opportunities.",
      welcomeMessage: "Ready to explore startup trends, funding insights, or venture opportunities?",
      origin: "Norse",
      samplePrompts: [
        "Show me the latest funding rounds in AI startups",
        "What are the hottest startup sectors right now?",
        "Analyze venture capital trends for 2024",
        "Find promising early-stage startups in fintech"
      ]
    }
  ];

  // Fix: Use the agent parameter directly to find the current agent
  const currentAgent = agents.find(a => a.id === agent) || agents.find(a => a.id === "odin");

  const chatHistory = [
    { id: 1, title: "Market Analysis Q3", date: "Today", time: "2:30 PM" },
    { id: 2, title: "Tesla Stock Discussion", date: "Today", time: "11:15 AM" },
    { id: 3, title: "Crypto Market Trends", date: "Yesterday", time: "4:20 PM" },
    { id: 4, title: "Portfolio Review", date: "Yesterday", time: "9:45 AM" },
    { id: 5, title: "Economic Indicators", date: "Sep 20", time: "3:15 PM" },
    { id: 6, title: "Sector Analysis", date: "Sep 19", time: "1:30 PM" },
  ];

  const models = [
    { id: 'mortal', name: 'Mortal', description: 'Basic intelligence' },
    { id: 'demi', name: 'Demi', description: 'Enhanced capabilities' },
    { id: 'god', name: 'God', description: 'Maximum intelligence' }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      // Simulate agent response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: `I'm ${currentAgent.name}, analyzing your request about "${message}". Based on my expertise in ${currentAgent.specialty.toLowerCase()}, here's what I can tell you...`, 
          sender: 'agent' 
        }]);
      }, 1000);
    }
  };

  const handlePromptClick = (prompt) => {
    setMessage(prompt);
    // Optional: auto-send the message
    // handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.getElementById('menu-button');
        if (sidebar && !sidebar.contains(event.target) && !menuButton?.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:relative
          fixed lg:static
          w-64 h-full
          bg-black border-r border-zinc-800 
          flex flex-col 
          transition-transform duration-300 ease-in-out
          z-50 lg:z-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="text-white font-bold text-lg">

                <img 
                    src="/asset/images/name-logo.png" 
                    alt="Noveris AI Intelligence Platform" 
                    className="h-6 w-auto md:h-6 lg:h-6 xl:h-6 filter drop-shadow-2xl"
                    onError={(e) => {
                      e.target.outerHTML = '<div class="h-16 md:h-20 lg:h-24 xl:h-32 w-32 md:w-40 lg:w-48 xl:w-64 bg-gradient-to-r from-white to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl lg:text-2xl">NOVERIS</div>';
                    }}
                  />
            </div>
          </div>
          <button 
            className="lg:hidden p-1 hover:bg-zinc-900 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button className="w-full flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 px-4 rounded-lg transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {chatHistory.reduce((acc, chat) => {
              const lastGroup = acc[acc.length - 1];
              if (lastGroup && lastGroup.date === chat.date) {
                lastGroup.chats.push(chat);
              } else {
                acc.push({ date: chat.date, chats: [chat] });
              }
              return acc;
            }, []).map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <div className="flex items-center space-x-2 px-2 py-1 text-xs text-zinc-500 font-medium">
                  <Calendar className="h-3 w-3" />
                  <span>{group.date}</span>
                </div>
                {group.chats.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full text-left p-2 hover:bg-zinc-900 rounded-lg transition-colors duration-150 group"
                  >
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-300 truncate group-hover:text-white">
                          {chat.title}
                        </p>
                        <p className="text-xs text-zinc-500">{chat.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-zinc-800">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center space-x-3 p-2 hover:bg-zinc-900 rounded-lg transition-colors duration-200"
            >
              <div className="h-8 w-8 bg-zinc-700 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-zinc-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-zinc-200">John Doe</p>
                <p className="text-xs text-zinc-500">Credits: 2,450</p>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>

            {/* User Menu */}
            {userMenuOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-2">
                <button className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-zinc-800 transition-colors text-sm">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-zinc-800 transition-colors text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-zinc-800 transition-colors text-sm">
                  <Crown className="h-4 w-4" />
                  <span>Upgrade Plan</span>
                </button>
                <hr className="my-2 border-zinc-700" />
                <button className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-zinc-800 transition-colors text-sm text-red-400">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

     {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-black flex-shrink-0">
          <button
            id="menu-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold">{currentAgent.name}</h1>
            <p className="text-xs text-zinc-500">{currentAgent.specialty}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto bg-black min-h-0">
         {messages.length === 0 ? (
  // Welcome Screen
  <div className="flex items-center justify-center min-h-full p-8">
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="h-20 w-20 mx-auto mb-6 rounded-full overflow-hidden  flex items-center justify-center">
          <img 
            src={currentAgent.avatar} 
            alt={currentAgent.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <span className="hidden text-2xl font-bold text-zinc-300 items-center justify-center h-full w-full">
            {currentAgent.name.charAt(0)}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-4">
          {currentAgent.greeting}
        </h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          {currentAgent.description}
        </p>
      </div>

      {/* Sample Prompts */}
      <div className="space-y-4 hidden lg:block">
        <div className="flex items-center justify-center space-x-2 text-zinc-500 mb-6">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Try asking me:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {currentAgent.samplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt)}
              className="text-left p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all duration-200 group"
            >
              <p className="text-sm text-zinc-300 group-hover:text-white">
                {prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
          ) : (
            // Chat Messages
            <div className="max-w-3xl mx-auto w-full">
              <div className="space-y-6 p-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'agent' && (
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-8 w-8 bg-zinc-800 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-zinc-300">
                            {currentAgent.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className={`max-w-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-zinc-800 text-white ml-12' 
                        : 'bg-black text-zinc-200 border border-zinc-800'
                    } rounded-lg p-4`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-zinc-900 rounded-xl border border-zinc-700 focus-within:border-zinc-600 transition-colors">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${currentAgent.name}...`}
                className="w-full bg-transparent text-white placeholder-zinc-500 border-none resize-none outline-none p-4 pr-32 min-h-[56px] max-h-40 overflow-y-auto"
                rows="1"
              />

              {/* Bottom Controls */}
              <div className="flex items-center justify-between px-4 pb-4">
                {/* Left side - File attachments */}
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
                    <Paperclip className="h-4 w-4 text-zinc-500" />
                  </button>
                  <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
                    <Image className="h-4 w-4 text-zinc-500" />
                  </button>
                </div>

                {/* Right side - Model selector and send */}
                <div className="flex items-center space-x-3">
                  {/* Model Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setModelMenuOpen(!modelMenuOpen)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm"
                    >
                      <span className="capitalize font-medium text-zinc-300">{selectedModel}</span>
                      <ChevronDown className="h-3 w-3 text-zinc-500" />
                    </button>

                    {modelMenuOpen && (
                      <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-2 min-w-40">
                        {models.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model.id);
                              setModelMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-800 transition-colors"
                          >
                            <div className="font-medium text-sm text-zinc-200">{model.name}</div>
                            <div className="text-xs text-zinc-500">{model.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4 text-zinc-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoverisChatPage;