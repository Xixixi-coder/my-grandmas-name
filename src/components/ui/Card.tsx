import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-stone-800 rounded-2xl p-8 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
