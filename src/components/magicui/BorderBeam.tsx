import React from 'react';
import { motion, type Transition } from 'motion/react';

export interface BorderBeamProps {
  /**
   * Additional custom class names
   */
  className?: string;
  /**
   * Size / length of the beam in pixels
   */
  size?: number;
  /**
   * Duration of one full loop around the card in seconds
   */
  duration?: number;
  /**
   * Delay before the animation starts in seconds
   */
  delay?: number;
  /**
   * Starting color for the gradient beam
   */
  colorFrom?: string;
  /**
   * Ending color for the gradient beam
   */
  colorTo?: string;
  /**
   * Motion transition override
   */
  transition?: Transition;
  /**
   * Custom CSS styles
   */
  style?: React.CSSProperties;
  /**
   * Reverse animation direction
   */
  reverse?: boolean;
  /**
   * Initial offset distance percentage (0 - 100)
   */
  initialOffset?: number;
  /**
   * Border width in pixels
   */
  borderWidth?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  size = 200,
  delay = 0,
  duration = 6,
  colorFrom = '#E01E7E',
  colorTo = '#00D5D8',
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 2,
}) => {
  return (
    <div
      style={
        {
          borderWidth: `${borderWidth}px`,
          WebkitMaskClip: 'padding-box, border-box',
          maskClip: 'padding-box, border-box',
          WebkitMaskComposite: 'xor',
          maskComposite: 'intersect',
          WebkitMaskImage:
            'linear-gradient(transparent, transparent), linear-gradient(#fff, #fff)',
          maskImage:
            'linear-gradient(transparent, transparent), linear-gradient(#fff, #fff)',
        } as React.CSSProperties
      }
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent z-10"
    >
      <motion.div
        className={`absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent ${className}`}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
            ...style,
          } as React.CSSProperties
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={
          transition || {
            repeat: Infinity,
            ease: 'linear',
            duration: duration,
            delay: delay,
          }
        }
      />
    </div>
  );
};
