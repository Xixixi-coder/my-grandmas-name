import { motion } from 'framer-motion';
import { useGenealogyStore } from '../stores/genealogyStore';
import { useNavigate } from 'react-router-dom';
import { getEraLabel, getEraColor } from '../utils/nameEraEngine';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { shareOrDownload } from '../utils/shareGenerator';

export const OutputPage = () => {
  const { grandmother, mother, user, reset } = useGenealogyStore();
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      await shareOrDownload('share-card');
    } catch {
      alert('生成分享图失败，请重试');
    }
  };

  const handleRestart = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-light text-center mb-12"
        >
          三代人的名字，三代人的想
        </motion.h1>

        {/* Shareable card */}
        <div id="share-card" className="bg-stone-800 rounded-2xl p-8 space-y-8">
          {[
            { person: grandmother, label: '外婆', font: 'font-handwritten' },
            { person: mother, label: '妈妈', font: 'font-serif-cn' },
            { person: user, label: '我', font: 'font-sans-cn' }
          ].map(({ person, label, font }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.4 }}
              className="border-b border-stone-700 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-stone-500 text-sm">{label}</span>
                {person.era && person.era !== 'unknown' && (
                  <span className={`text-xs ${getEraColor(person.era)}`}>
                    {getEraLabel(person.era)}
                  </span>
                )}
              </div>
              <p className={`text-2xl ${font} text-stone-100 mb-2`}>
                {person.fullName}
              </p>
              {person.youngWish && (
                <p className="text-stone-400 text-sm">
                  想{person.youngWish}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex flex-col gap-4"
        >
          <Button onClick={handleShare}>保存/分享这张卡片</Button>
          <Button variant="secondary" onClick={handleRestart}>
            重新开始
          </Button>
        </motion.div>

        <Card className="mt-8 !bg-stone-800/50">
          <p className="text-stone-500 text-sm text-center leading-relaxed">
            你正站在她们无法抵达的地方。<br />
            你的自由，是三代人的接力。
          </p>
        </Card>
      </div>
    </div>
  );
};
