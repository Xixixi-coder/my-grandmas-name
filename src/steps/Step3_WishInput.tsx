import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { TypewriterText } from '../components/animations/TypewriterText';
import { useGenealogyStore } from '../stores/genealogyStore';
import { validateWish } from '../utils/validators';

export const Step3_WishInput = () => {
  const { grandmother, setPersonData, nextStep } = useGenealogyStore();
  const [wish, setWish] = useState(grandmother.youngWish || '');
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = () => {
    const validation = validateWish(wish);
    if (!validation.valid) {
      setError(validation.message || '');
      return;
    }
    setPersonData('grandmother', { youngWish: wish.trim() });
    nextStep();
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <TypewriterText
        text={`${grandmother.fullName || '她'}年轻的时候，最想成为什么？`}
        speed={50}
        className="text-xl text-stone-200 block mb-4"
        onComplete={() => setShowInput(true)}
      />

      <p className="text-stone-500 text-sm mb-8">
        如果不知道，可以猜——她曾经的眼神里，藏着什么？
      </p>

      {showInput && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <textarea
            value={wish}
            onChange={(e) => {
              setWish(e.target.value);
              setError('');
            }}
            placeholder="比如：想当老师 / 想去看海 / 想自己做主嫁给谁..."
            className="w-full bg-stone-800/50 border border-stone-700 rounded-xl p-4
                     text-stone-200 placeholder:text-stone-600 outline-none
                     focus:border-amber-600 resize-none min-h-[120px] transition-colors"
            autoFocus
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-600">{wish.length}/200</span>
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
          <Button onClick={handleSubmit} disabled={!wish.trim()}>
            下一步 →
          </Button>
        </motion.div>
      )}
    </div>
  );
};
