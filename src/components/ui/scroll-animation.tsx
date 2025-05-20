
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number; // percentage of element that must be visible
  delay?: number; // delay in ms
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
}

export const ScrollAnimation = ({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  animation = 'fade-up'
}: ScrollAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollPosition = useScrollPosition();
  
  useEffect(() => {
    const checkIfVisible = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Element is visible when it's in the viewport
      const elementTop = rect.top;
      const elementVisible = threshold * rect.height;
      
      if (elementTop < windowHeight - elementVisible) {
        setTimeout(() => {
          setIsVisible(true);
        }, delay);
      }
    };
    
    checkIfVisible();
  }, [scrollPosition, threshold, delay]);
  
  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-700";
    
    if (!isVisible) {
      switch(animation) {
        case 'fade-up':
          return `${baseClasses} opacity-0 translate-y-10`;
        case 'fade-in':
          return `${baseClasses} opacity-0`;
        case 'slide-left':
          return `${baseClasses} opacity-0 -translate-x-10`;
        case 'slide-right':
          return `${baseClasses} opacity-0 translate-x-10`;
        case 'zoom-in':
          return `${baseClasses} opacity-0 scale-95`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }
    
    return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`;
  };
  
  return (
    <div 
      ref={ref}
      className={cn(getAnimationClasses(), className)}
    >
      {children}
    </div>
  );
};
