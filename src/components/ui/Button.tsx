import { type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const base = 'px-6 py-3 rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-amber-600 hover:bg-amber-500 text-white',
    secondary: 'border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-stone-100',
    ghost: 'text-stone-500 hover:text-stone-300'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...(props as object)}
    >
      {children}
    </motion.button>
  );
};
