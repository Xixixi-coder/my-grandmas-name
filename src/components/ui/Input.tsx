import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const Input = ({ onSubmit, className = '', value, onChange, placeholder, autoFocus }: InputProps) => {
  const [composing, setComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !composing && onSubmit) {
        const val = inputRef.current?.value?.trim();
        if (val) onSubmit(val);
      }
    },
    [composing, onSubmit]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full bg-transparent border-b-2 border-stone-700 focus:border-amber-400
                   text-xl py-3 px-2 outline-none transition-colors
                   placeholder:text-stone-600 ${className}`}
      />
    </motion.div>
  );
};
