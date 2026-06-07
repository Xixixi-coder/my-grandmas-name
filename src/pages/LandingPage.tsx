import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TypewriterText } from '../components/animations/TypewriterText';
import { useGenealogyStore } from '../stores/genealogyStore';
import { LANDING_TEXTS, PRIVACY_NOTICE } from '../constants/copywriting';

export const LandingPage = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showUnknown, setShowUnknown] = useState(false);
  const [composing, setComposing] = useState(false);

  const navigate = useNavigate();
  const { setPersonData, setMode } = useGenealogyStore();

  const handleLineComplete = useCallback(() => {
    if (currentLine < LANDING_TEXTS.length - 1) {
      setCurrentLine((prev) => prev + 1);
    } else {
      setShowInput(true);
      setTimeout(() => setShowUnknown(true), 1000);
    }
  }, [currentLine]);

  const handleSubmit = () => {
    const name = inputValue.trim();
    if (name) {
      setPersonData('grandmother', { id: 'grandmother', fullName: name });
      setMode('normal');
      navigate('/flow');
    }
  };

  const handleUnknown = () => {
    setMode('completion');
    navigate('/completion');
  };

  return (
    <div className="min-h-screen bg-black text-stone-300 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-6">
        {LANDING_TEXTS.map((text, index) => (
          <AnimatePresence key={index}>
            {index <= currentLine && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl md:text-2xl font-light tracking-wide"
              >
                <TypewriterText
                  text={text}
                  speed={60}
                  delay={index === 0 ? 500 : 300}
                  onComplete={index === currentLine ? handleLineComplete : undefined}
                  className={index === 1 ? 'text-amber-400' : ''}
                />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 w-full max-w-md"
          >
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={() => setComposing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !composing) handleSubmit();
                }}
                placeholder="输入她的名字..."
                className="w-full bg-transparent border-b-2 border-stone-700 focus:border-amber-400
                         text-xl py-3 px-2 outline-none transition-colors placeholder:text-stone-600"
                autoFocus
              />
              {inputValue.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleSubmit}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 text-xl"
                >
                  →
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUnknown && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleUnknown}
            className="mt-8 text-sm text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-4"
          >
            我不知道外婆的名字
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 text-xs text-stone-600"
      >
        按 Enter 继续 · {PRIVACY_NOTICE}
      </motion.div>
    </div>
  );
};
