import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export const TypewriterText = ({
  text,
  speed = 80,
  delay = 0,
  onComplete,
  className = ''
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    indexRef.current = 0;
    setDisplayedText('');

    const tick = () => {
      indexRef.current += 1;
      if (indexRef.current <= text.length) {
        setDisplayedText(text.slice(0, indexRef.current));
        timer = setTimeout(tick, speed);
      } else {
        onCompleteRef.current?.();
      }
    };

    let timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [text, speed, started]);

  if (!started) return null;

  return (
    <span className={className}>
      {displayedText}
      <AnimatePresence>
        {displayedText.length < text.length && (
          <motion.span
            className="inline-block w-[2px] h-[1.2em] bg-current ml-[1px] align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </span>
  );
};
