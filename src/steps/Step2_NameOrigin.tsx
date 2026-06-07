import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { TypewriterText } from '../components/animations/TypewriterText';
import { useGenealogyStore } from '../stores/genealogyStore';
import { getQuestionsByEra, getEraLabel, getEraColor } from '../utils/nameEraEngine';

export const Step2_NameOrigin = () => {
  const { grandmother, setPersonData, nextStep } = useGenealogyStore();
  const era = grandmother.era || 'unknown';
  const eraQuestion = getQuestionsByEra(era);
  const [selected, setSelected] = useState<string | null>(null);
  const [customStory, setCustomStory] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleNext = () => {
    const category =
      selected === 'beauty' || selected === 'son' || selected === 'casual'
        ? 'family_expectation'
        : selected === 'political' || selected === 'practical'
          ? 'era_mark'
          : selected === 'neutral' || selected === 'artistic' || selected === 'single'
            ? 'breakthrough'
            : selected === 'careful' || selected === 'fortune' || selected === 'trend'
              ? 'parent_choice'
              : 'other';

    setPersonData('grandmother', {
      nameOrigin: {
        category,
        customStory: selected === 'other' ? customStory : undefined
      }
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <div className="mb-4">
        <span className={`text-xs ${getEraColor(era)}`}>
          {getEraLabel(era)}
        </span>
      </div>

      <TypewriterText
        text={eraQuestion.question}
        speed={50}
        className="text-xl text-stone-200 block mb-8"
        onComplete={() => setShowOptions(true)}
      />

      {showOptions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {eraQuestion.options.map((option) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelected(option.value)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all
                ${
                  selected === option.value
                    ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                    : 'border-stone-700 hover:border-stone-500 text-stone-300'
                }`}
            >
              {option.label}
            </motion.button>
          ))}

          {selected === 'other' && (
            <motion.textarea
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              value={customStory}
              onChange={(e) => setCustomStory(e.target.value)}
              placeholder="说说你知道的故事..."
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-4
                       text-stone-200 placeholder:text-stone-600 outline-none
                       focus:border-stone-500 resize-none min-h-[100px]"
            />
          )}

          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4"
            >
              <Button onClick={handleNext}>继续 →</Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
