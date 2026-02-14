import { useState } from 'react';
import { Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalWrapper from '../ui/ModalWrapper';

type SleepinessDetectorProps = {
  onClose: () => void;
};

const questions = [
  {
    id: 1,
    question: 'How alert do you feel right now?',
    options: [
      { text: 'Very alert', score: 0 },
      { text: 'Fairly alert', score: 25 },
      { text: 'Somewhat tired', score: 50 },
      { text: 'Very tired', score: 75 },
      { text: 'Extremely tired', score: 100 },
    ],
  },
  {
    id: 2,
    question: 'Are you struggling to keep your eyes open?',
    options: [
      { text: 'Not at all', score: 0 },
      { text: 'A little', score: 33 },
      { text: 'Quite a bit', score: 66 },
      { text: 'Yes, very much', score: 100 },
    ],
  },
  {
    id: 3,
    question: 'How difficult is it to concentrate?',
    options: [
      { text: 'Easy to focus', score: 0 },
      { text: 'Slightly difficult', score: 33 },
      { text: 'Moderately difficult', score: 66 },
      { text: 'Very difficult', score: 100 },
    ],
  },
  {
    id: 4,
    question: 'Would you fall asleep if you sat still for 10 minutes?',
    options: [
      { text: 'No chance', score: 0 },
      { text: 'Unlikely', score: 33 },
      { text: 'Possibly', score: 66 },
      { text: 'Definitely', score: 100 },
    ],
  },
];

export default function SleepinessDetector({
  onClose,
}: SleepinessDetectorProps) {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<{
    level: string;
    percentage: number;
  } | null>(null);

  const handleAnswer = (questionId: number, score: number) => {
    const updatedAnswers = { ...answers, [questionId]: score };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    } else {
      calculateSleepiness(updatedAnswers);
    }
  };

  const calculateSleepiness = (finalAnswers: {
    [key: number]: number;
  }) => {
    const totalScore = Object.values(finalAnswers).reduce(
      (a, b) => a + b,
      0
    );
    const percentage = Math.round(totalScore / questions.length);

    let level = 'Low';
    if (percentage > 65) level = 'High';
    else if (percentage > 35) level = 'Moderate';

    setResult({ level, percentage });
  };

  const currentQuestion = questions[currentQuestionIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <ModalWrapper
      title="Class Sleepiness Detector"
      icon={<Moon className="w-6 h-6 text-white" />}
      onClose={onClose}
    >
      {!result ? (
        <div className="space-y-8">

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>
                {Math.round(
                  ((currentQuestionIndex + 1) / questions.length) * 100
                )}%
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                animate={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">
                {currentQuestion.question}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected =
                    answers[currentQuestion.id] === option.score;

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.97 }}
                      animate={
                        isSelected
                          ? { scale: 1.03 }
                          : { scale: 1 }
                      }
                      transition={{ type: 'spring', stiffness: 300 }}
                      onClick={() =>
                        handleAnswer(currentQuestion.id, option.score)
                      }
                      className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500'
                        }
                      `}
                    >
                      {option.text}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center">
            <div
              className={`text-4xl font-bold ${
                result.level === 'High'
                  ? 'text-red-400'
                  : result.level === 'Moderate'
                  ? 'text-orange-400'
                  : 'text-emerald-400'
              }`}
            >
              {result.level}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Sleepiness Level
            </div>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.percentage}%` }}
              transition={{ duration: 0.6 }}
              className={`h-full ${
                result.level === 'High'
                  ? 'bg-gradient-to-r from-red-400 to-red-600'
                  : result.level === 'Moderate'
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                  : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
              }`}
            />
          </div>

          <div className="text-center text-slate-400 text-sm">
            {result.percentage}% Sleepiness
          </div>

          <button
            onClick={() => {
              setAnswers({});
              setResult(null);
              setCurrentQuestionIndex(0);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-all duration-200 active:scale-95"
          >
            Retake Assessment
          </button>
        </motion.div>
      )}
    </ModalWrapper>
  );
}
