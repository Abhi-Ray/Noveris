"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Galaxy from '../../ui/bg';
import Link from 'next/link';
const agents = [
  { 
    id: "fortuna", 
    label: "Fortuna", 
    specialty: "Market & Stock Intelligence", 
    img: "/asset/agent/fortuna.webp",
    description: "Harness predictive insights for equities, commodities, and financial trends. Ideal for traders, investors, and analysts seeking to navigate market volatility.",
    origin: "Roman"
  },
  { 
    id: "loki", 
    label: "Loki", 
    specialty: "Influence & Reputation Intelligence", 
    img: "/asset/agent/loki.webp",
    description: "Monitor, analyze, and protect public perception across celebrities, politicians, and brands. Perfect for PR firms, brand managers, and media teams.",
    origin: "Norse"
  },
  { 
    id: "yama", 
    label: "Yama", 
    specialty: "Legal Risk & Compliance Intelligence", 
    img: "/asset/agent/yama.webp",
    description: "Track litigation, contracts, regulatory changes, and risk exposure. Designed for law firms, corporate legal teams, and compliance officers.",
    origin: "Hindu"
  },
  { 
    id: "vastu", 
    label: "Vastu", 
    specialty: "Real Estate & Property Intelligence", 
    img: "/asset/agent/vastu.webp",
    description: "Evaluate property trends, land value, and project viability. Ideal for developers, realtors, and real estate investors.",
    origin: "Hindu"
  },
  { 
    id: "athena", 
    label: "Athena", 
    specialty: "Government Tender & Procurement Intelligence", 
    img: "/asset/agent/athena.webp",
    description: "Access insights on public contracts, bids, and tender opportunities. Perfect for businesses participating in government projects and procurement processes.",
    origin: "Greek"
  },
  { 
    id: "anubis", 
    label: "Anubis", 
    specialty: "Pharma & Healthcare Intelligence", 
    img: "/asset/agent/anubis.webp",
    description: "Track drug pipelines, clinical trials, regulations, and market trends. Designed for pharmaceutical companies, research labs, and healthcare strategists.",
    origin: "Egyptian"
  },
  { 
    id: "odin", 
    label: "Odin", 
    specialty: "Startup & Venture Intelligence", 
    img: "/asset/agent/odin.webp",
    description: "Monitor emerging startups, funding rounds, and innovation trends. Ideal for venture capitalists, accelerators, and entrepreneurs.",
    origin: "Norse"
  }
];

const TypewriterText = ({ text, isVisible }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setDisplayText('');
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [text, isVisible]);

  return <span>{displayText}</span>;
};

const NoverisHomepage = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [shuffledAgents, setShuffledAgents] = useState([]);

  useEffect(() => {
    // Shuffle agents on each reload
    const shuffled = [...agents].sort(() => Math.random() - 0.5);
    setShuffledAgents(shuffled);
    
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  

  const handleBackgroundClick = (e) => {
    // Only close if clicking on background, not on agent details
    if (e.target === e.currentTarget || !e.target.closest('.agent-details-container')) {
      setSelectedAgent(null);
    }
  };

  // Calculate heptagonal positions
  const getHeptagonPosition = (index, radius) => {
    const angle = (index * 2 * Math.PI) / 7 - Math.PI / 2; // Start from top
    const x = 50 + (radius * Math.cos(angle));
    const y = 50 + (radius * Math.sin(angle));
    return { x, y };
  };

  const getHoveredAgentDescription = () => {
    if (!hoveredAgent) return "AI INTELLIGENCE PLATFORM";
    const agent = agents.find(a => a.id === hoveredAgent);
    return agent ? agent.description : "AI INTELLIGENCE PLATFORM";
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden" onClick={handleBackgroundClick}>
      {/* Background Galaxy */}
      <div className="absolute inset-0 w-full h-full">
        <Galaxy 
          density={1.25}
          glowIntensity={0.2}
          saturation={0.5}
          hueShift={180}
          twinkleIntensity={1}
          rotationSpeed={0.1}
          repulsionStrength={1}
          starSpeed={0.5}
          speed={1}
          transparent={false}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl aspect-square max-h-[80vh]">
          
          {/* Center Content */}
          <div className={`absolute inset-0 flex items-center justify-center transform transition-all duration-1000 ${isLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <div className="relative group">
                {/* Logo container */}
                <div className="relative bg-black/60 backdrop-blur-sm border border-gray-700/50 rounded-full p-6 md:p-8 lg:p-8">
                  <img 
                    src="/asset/images/full-logo.png" 
                    alt="Noveris AI Intelligence Platform" 
                    className="h-16 w-auto md:h-20 lg:h-24 xl:h-32 filter drop-shadow-2xl"
                    onError={(e) => {
                      e.target.outerHTML = '<div class="h-16 md:h-20 lg:h-24 xl:h-32 w-32 md:w-40 lg:w-48 xl:w-64 bg-gradient-to-r from-white to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl lg:text-2xl">NOVERIS</div>';
                    }}
                  />
                </div>

                {/* Dynamic Text with Typewriter Effect */}
                <div className="absolute -bottom-16 left-1/2 transform  -translate-x-1/2  w-[400px] lg:w-[600px] hidden md:block">
  <div className="flex items-center justify-center space-x-2">
    <div className="h-px w-4 bg-gradient-to-r from-transparent to-white"></div>
    <p className="text-xs md:text-sm text-white font-light tracking-widest min-h-4 text-center">
      <TypewriterText 
        text={getHoveredAgentDescription()} 
        isVisible={true}
      />
    </p>
    <div className="h-px w-4 bg-gradient-to-l from-transparent to-white"></div>
  </div>
</div>
              </div>
          </div>

          {/* Heptagonal Agent Layout - Only show when no agent is selected */}
          {!selectedAgent && shuffledAgents.map((agent, index) => {
            const radius = window.innerWidth < 768 ? 35 : window.innerWidth < 1024 ? 38 : 40;
            const position = getHeptagonPosition(index, radius);
            
            return (
              <Link href={`/chat/${agent.id}`} key={agent.id}>
              <div
                
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 hover:scale-110 cursor-pointer ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transitionDelay: `${800 + index * 150}ms`
                }}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
               
              >
                {/* Agent Card */}
                <div className="relative group">
                  {/* Agent Container */}
                  <div className="relative bg-black/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden group-hover:border-white/60 transition-all duration-300 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                    {/* Agent Image */}
                    <div className="relative w-full h-full">
                      <img
                        src={agent.img}
                        alt={agent.label}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 rounded-xl"
                        onError={(e) => {
                          e.target.outerHTML = `<div class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center"><span class="text-white font-bold text-xs md:text-sm">${agent.label[0]}</span></div>`;
                        }}
                      />
                    </div>
                  </div>

                  {/* Agent Label (appears on hover) */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                    <div className="bg-black/80 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 whitespace-nowrap">
                      <p className="text-xs md:text-sm text-center font-bold text-white">{agent.label}</p>
                      <p className="text-xs text-gray-400">{agent.specialty}</p>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .aspect-square {
            aspect-ratio: 1;
            max-height: 80vh;
          }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default NoverisHomepage;
