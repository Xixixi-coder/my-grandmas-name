import { motion } from 'framer-motion';

interface FadeInLetterProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export const FadeInLetter = ({
  text,
  delay = 0,
  staggerDelay = 0.05,
  className = ''
}: FadeInLetterProps) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * staggerDelay,
            duration: 0.3,
            ease: 'easeOut'
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};
