import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGenealogyStore } from '../stores/genealogyStore';
import { FadeInLetter } from '../components/animations/FadeInLetter';

export const Step6_Generate = () => {
  const navigate = useNavigate();
  const { grandmother, mother, user } = useGenealogyStore();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/output'), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-stone-500 text-sm"
      >
        三代人的名字与愿望
      </motion.p>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-grandma"
        >
          <FadeInLetter
            text={grandmother.fullName || ''}
            delay={0.5}
            className="text-3xl font-handwritten"
          />
          <p className="text-stone-500 text-sm mt-2">
            想{grandmother.youngWish?.slice(0, 20)}...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="text-stone-700"
        >
          ↓
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-mother"
        >
          <FadeInLetter
            text={mother.fullName || ''}
            delay={1.8}
            className="text-3xl font-serif-cn"
          />
          <p className="text-stone-500 text-sm mt-2">
            想{mother.youngWish?.slice(0, 20)}...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2.5 }}
          className="text-stone-700"
        >
          ↓
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <FadeInLetter
            text={user.fullName || ''}
            delay={3.3}
            className="text-3xl font-sans-cn text-stone-100"
          />
          <p className="text-stone-500 text-sm mt-2">
            想{user.youngWish?.slice(0, 20)}...
          </p>
        </motion.div>
      </div>
    </div>
  );
};
