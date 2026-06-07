import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TypewriterText } from '../components/animations/TypewriterText';
import { useGenealogyStore } from '../stores/genealogyStore';
import { validateChineseName } from '../utils/validators';
import { detectEra } from '../utils/nameEraEngine';

export const Step4_MotherRepeat = () => {
  const { setPersonData, nextStep } = useGenealogyStore();
  const mother = useGenealogyStore((s) => s.mother);
  const [name, setName] = useState(mother.fullName || '');
  const [wish, setWish] = useState(mother.youngWish || '');
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
    setPersonData('mother', { id: 'mother', fullName: name.trim(), era });
    setPhase('wish');
    setError('');
  };

  const handleWishSubmit = () => {
    if (!wish.trim()) {
      setError('写点什么吧');
      return;
    }
    setPersonData('mother', { youngWish: wish.trim() });
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {phase === 'name' && (
        <>
          <TypewriterText
            text="现在，你妈妈叫什么名字？"
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
                placeholder="妈妈的全名..."
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
            text={`${name}年轻时最想做什么？`}
            speed={50}
            className="text-xl text-stone-200 block mb-4"
          />
          <p className="text-stone-500 text-sm mb-6">
            她说过"要不是为了你们..."后面是什么？
          </p>
          <textarea
            value={wish}
            onChange={(e) => {
              setWish(e.target.value);
              setError('');
            }}
            placeholder="比如：想去南方闯闯 / 想继续读书 / 想开个小店..."
            className="w-full bg-stone-800/50 border border-stone-700 rounded-xl p-4
                     text-stone-200 placeholder:text-stone-600 outline-none
                     focus:border-amber-600 resize-none min-h-[100px] transition-colors"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <div className="mt-4">
            <Button onClick={handleWishSubmit} disabled={!wish.trim()}>
              下一步 →
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
