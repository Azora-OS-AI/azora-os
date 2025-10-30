
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassmorphicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassmorphicLayout({ children, className = '' }: GlassmorphicLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      <AnimatePresence>
        {isMounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-500"
                style={{
                  width: `${Math.random() * 150 + 50}px`,
                  height: `${Math.random() * 150 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.1 + 0.05,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50, 0],
                  y: [0, Math.random() * 100 - 50, 0],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative z-10 min-h-screen flex items-center justify-center p-4 ${className}`}>
        <motion.div
          className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="p-8">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
