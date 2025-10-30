/*
AZORA PROPRIETARY LICENSE
Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.
*/

'use client';

import React, { useState, useEffect } from 'react';

interface GlassmorphicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassmorphicLayout({ children, className = '' }: GlassmorphicLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background visualization elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-200 opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
        
        {/* Service visualization nodes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-green-300 opacity-30 blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-purple-300 opacity-30 blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-yellow-300 opacity-30 blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-18 h-18 rounded-full bg-red-300 opacity-30 blur-xl animate-pulse" />
      </div>

      {/* Main content with glassmorphic effect */}
      <div className={`relative z-10 min-h-screen backdrop-blur-sm ${className}`}>
        <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl border border-white border-opacity-20 shadow-xl" />
        <div className="relative z-20">
          {children}
        </div>
      </div>

      {/* Connection lines between services */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        <line 
          x1="25%" y1="25%" 
          x2="66%" y2="33%" 
          stroke="rgba(99, 102, 241, 0.3)" 
          strokeWidth="1" 
          strokeDasharray="5,5"
        />
        <line 
          x1="66%" y1="33%" 
          x2="25%" y2="75%" 
          stroke="rgba(99, 102, 241, 0.3)" 
          strokeWidth="1" 
          strokeDasharray="5,5"
        />
        <line 
          x1="25%" y1="75%" 
          x2="75%" y2="66%" 
          stroke="rgba(99, 102, 241, 0.3)" 
          strokeWidth="1" 
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  );
}