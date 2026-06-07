import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { TypewriterText } from '../components/animations/TypewriterText';
import { useGenealogyStore } from '../stores/genealogyStore';
import { validateChineseName } from '../utils/validators';
import { detectEra } from '../utils/nameEraEngine';

interface StepProps {
  target: 'grandmother' | 'mother' | 'user';
  prompt: string;
  placeholder?: string;
}

export const Step1_NameInput = () => {
  return <NameInputStep target="grandmother" prompt="外婆叫什么名字？" placeholder="输入她的全名..." />;
};

const NameInputStep = ({ target, prompt, placeholder }: StepProps) => {
  const { setPersonData, nextStep } = useGenealogyStore();
  const person = useGenealogyStore((s) => s[target]);
  const [name, setName] = useState(person.fullName || '');
  const [birthYear, setBirthYear] = useState(person.birthYear?.toString() || '');
  const [error, setError] = useState('');
  const [showBirthYear, setShowBirthYear] = useState(false);

  const handleSubmit = () => {
    const validation = validateChineseName(name);
    if (!validation.valid) {
      setError(validation.message || '');
      return;
    }

    const year = birthYear ? parseInt(birthYear, 10) : undefined;
    const { era } = detectEra(name, year);

    setPersonData(target, {
      id: target,
      fullName: name.trim(),
      birthYear: year,
      era
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <TypewriterText
        text={prompt}
        speed={60}
        className="text-2xl text-stone-200 block mb-10"
        onComplete={() => setShowBirthYear(true)}
      />

      <div className="space-y-6">
        <div>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            onSubmit={handleSubmit}
            placeholder={placeholder || '输入名字...'}
            autoFocus
          />
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs mt-2"
            >
              {error}
            </motion.p>
          )}
        </div>

        {showBirthYear && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="出生年份（选填，如 1952）"
              className="w-full bg-transparent border-b border-stone-800 focus:border-stone-600
                       text-sm py-2 px-2 outline-none transition-colors
                       placeholder:text-stone-700 text-stone-400"
            />
          </motion.div>
        )}

        <Button onClick={handleSubmit} disabled={!name.trim()}>
          下一步 →
        </Button>
      </div>
    </div>
  );
};
