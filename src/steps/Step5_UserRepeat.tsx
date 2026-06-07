import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TypewriterText } from '../components/animations/TypewriterText';
import { useGenealogyStore } from '../stores/genealogyStore';
import { validateChineseName } from '../utils/validators';
import { detectEra } from '../utils/nameEraEngine';

export const Step5_UserRepeat = () => {
  const { setPersonData, nextStep } = useGenealogyStore();
  const user = useGenealogyStore((s) => s.user);
  const [name, setName] = useState(user.fullName || '');
  const [wish, setWish] = useState(user.youngWish || '');
  const [phase, setPhase] = useState<'name' | 'wish'>('name');
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleNameSubmit = () => {
    const validation = validateChineseName(name);
    if (!validation.valid) {
      setError(validation.message || '');
      return;
    }
    const { era } = detectEra(name);
    setPersonData('user', { id: 'user', fullName: name.trim(), era });
    setPhase('wish');
    setError('');
  };

  const handleWishSubmit = () => {
    if (!wish.trim()) {
      setError('写点什么吧');
      return;
    }
    setPersonData('user', { youngWish: wish.trim() });
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {phase === 'name' && (
        <>
          <TypewriterText
            text="最后——你自己叫什么？"
            speed={50}
            className="text-xl text-stone-200 block mb-8"
            onComplete={() => setShowInput(true)}
          />

          {showInput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                onSubmit={handleNameSubmit}
                placeholder="你的全名..."
                autoFocus
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <Button onClick={handleNameSubmit} disabled={!name.trim()}>
                继续 →
              </Button>
            </motion.div>
          )}
        </>
      )}

      {phase === 'wish' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <TypewriterText
            text="你现在最想做的事是什么？"
            speed={50}
            className="text-xl text-stone-200 block mb-4"
          />
          <p className="text-stone-500 text-sm mb-6">不用想太多，第一反应</p>
          <textarea
            value={wish}
            onChange={(e) => {
              setWish(e.target.value);
              setError('');
            }}
            placeholder="比如：想辞职去旅行 / 想写一本书 / 想好好睡一觉..."
            className="w-full bg-stone-800/50 border border-stone-700 rounded-xl p-4
                     text-stone-200 placeholder:text-stone-600 outline-none
                     focus:border-amber-600 resize-none min-h-[100px] transition-colors"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <div className="mt-4">
            <Button onClick={handleWishSubmit} disabled={!wish.trim()}>
              看看三代人的答案 →
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
