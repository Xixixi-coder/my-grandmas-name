import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGenealogyStore } from '../stores/genealogyStore';
import { INTERVIEW_QUESTIONS } from '../constants/copywriting';

export const CompletionMode = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { setMode } = useGenealogyStore();

  const copyQuestions = useCallback(async () => {
    const text = INTERVIEW_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleReturn = () => {
    setMode('normal');
    navigate('/flow');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl font-light mb-4">87%的人和你一样</h1>
          <p className="text-stone-400">但你可以现在开始问</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-stone-800 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-lg mb-6 text-amber-400">采访妈妈的10个问题</h2>
          <ol className="space-y-4">
            {INTERVIEW_QUESTIONS.map((question, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-stone-300 text-sm leading-relaxed"
              >
                <span className="text-amber-600 mr-2">{index + 1}.</span>
                {question}
              </motion.li>
            ))}
          </ol>
        </motion.div>

        <div className="flex flex-col gap-4">
          <button
            onClick={copyQuestions}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors text-center"
          >
            {copied ? '已复制到剪贴板 ✓' : '复制这些问题，发给妈妈'}
          </button>

          <button
            onClick={handleReturn}
            className="w-full py-4 border border-stone-700 hover:border-stone-500 rounded-xl transition-colors text-stone-400 hover:text-stone-200"
          >
            我已经问完了，回去填写 →
          </button>
        </div>

        <p className="text-center text-xs text-stone-600 mt-8">
          这些问题也可以问姨妈、舅舅、或者任何记得她的人
        </p>
      </div>
    </div>
  );
};
