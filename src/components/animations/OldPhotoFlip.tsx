import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface OldPhotoFlipProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const OldPhotoFlip = ({
  children,
  className = '',
  delay = 0
}: OldPhotoFlipProps) => {
  return (
    <motion.div
      className={`perspective-[800px] ${className}`}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{
        delay,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};
