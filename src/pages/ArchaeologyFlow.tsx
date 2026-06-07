import { AnimatePresence, motion } from 'framer-motion';
import { useGenealogyStore } from '../stores/genealogyStore';
import { Step1_NameInput } from '../steps/Step1_NameInput';
import { Step2_NameOrigin } from '../steps/Step2_NameOrigin';
import { Step3_WishInput } from '../steps/Step3_WishInput';
import { Step4_MotherRepeat } from '../steps/Step4_MotherRepeat';
import { Step5_UserRepeat } from '../steps/Step5_UserRepeat';
import { Step6_Generate } from '../steps/Step6_Generate';

const steps = [
  Step1_NameInput,
  Step2_NameOrigin,
  Step3_WishInput,
  Step4_MotherRepeat,
  Step5_UserRepeat,
  Step6_Generate
];

const stepVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 }
};

export const ArchaeologyFlow = () => {
  const { currentStep, prevStep } = useGenealogyStore();
  const CurrentStepComponent = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 overflow-hidden">
      {/* Progress indicator */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className="h-1 rounded-full"
            animate={{
              width: index < currentStep ? 32 : 8,
              backgroundColor: index < currentStep ? '#fbbf24' : index === currentStep - 1 ? '#d97706' : '#44403c'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="min-h-screen flex items-center justify-center px-4"
        >
          <CurrentStepComponent />
        </motion.div>
      </AnimatePresence>

      {/* Back button */}
      {currentStep > 1 && currentStep < 6 && (
        <button
          onClick={prevStep}
          className="fixed bottom-8 left-8 px-4 py-2 text-sm text-stone-500 hover:text-stone-300 transition-colors"
        >
          ← 上一步
        </button>
      )}
    </div>
  );
};
