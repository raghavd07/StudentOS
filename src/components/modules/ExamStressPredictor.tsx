import { useState } from 'react';
import { Brain } from 'lucide-react';
import ModalWrapper from '../ui/ModalWrapper';

type ExamStressPredictorProps = {
  onClose: () => void;
};

export default function ExamStressPredictor({
  onClose,
}: ExamStressPredictorProps) {
  const [numSubjects, setNumSubjects] = useState('');
  const [syllabusCompletion, setSyllabusCompletion] = useState('');
  const [daysRemaining, setDaysRemaining] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [result, setResult] = useState<{
    level: string;
    percentage: number;
    color: string;
  } | null>(null);

  const calculateStress = () => {
    const subjects = parseInt(numSubjects);
    const completion = parseFloat(syllabusCompletion);
    const days = parseInt(daysRemaining);
    const hours = parseFloat(studyHours);

    if (
      isNaN(subjects) ||
      isNaN(completion) ||
      isNaN(days) ||
      isNaN(hours)
    ) {
      alert('Please enter valid numbers');
      return;
    }

    const remainingSyllabus = 100 - completion;
    const totalStudyTimeAvailable = days * hours;
    const requiredTimePerSubject = (remainingSyllabus / 100) * 10;
    const totalRequiredTime = subjects * requiredTimePerSubject;

    const timeRatio = totalStudyTimeAvailable / totalRequiredTime;
    const completionFactor = completion / 100;
    const daysFactor = Math.max(0, (30 - days) / 30);

    let stressScore =
      (1 - completionFactor) * 40 + (1 - timeRatio) * 40 + daysFactor * 20;
    stressScore = Math.max(0, Math.min(100, stressScore));

    let level = 'Low';
    let color = 'green';

    if (stressScore > 65) {
      level = 'High';
      color = 'red';
    } else if (stressScore > 35) {
      level = 'Moderate';
      color = 'orange';
    }

    setResult({
      level,
      percentage: Math.round(stressScore),
      color,
    });
  };

  return (
  <ModalWrapper
    title="Exam Stress Predictor"
    icon={<Brain className="w-6 h-6 text-white" />}
    onClose={onClose}
  >
    <div className="space-y-6">

      {/* Inputs */}
      {[
        {
          label: 'Number of Subjects',
          value: numSubjects,
          setter: setNumSubjects,
          placeholder: 'Enter number of subjects',
          min: 1,
        },
        {
          label: 'Syllabus Completion Percentage',
          value: syllabusCompletion,
          setter: setSyllabusCompletion,
          placeholder: 'Enter completion %',
          min: 0,
          max: 100,
        },
        {
          label: 'Days Remaining for Exams',
          value: daysRemaining,
          setter: setDaysRemaining,
          placeholder: 'Enter days remaining',
          min: 0,
        },
        {
          label: 'Average Daily Study Hours',
          value: studyHours,
          setter: setStudyHours,
          placeholder: 'Enter study hours per day',
          min: 0,
          max: 24,
          step: 0.5,
        },
      ].map((field, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            {field.label}
          </label>
          <input
            type="number"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        </div>
      ))}

      {/* Button */}
      <button
        onClick={calculateStress}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95"
      >
        Calculate Stress Level
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">

          <h3 className="text-lg font-semibold text-white mb-6">
            Stress Assessment
          </h3>

          {/* Level */}
          <div className="text-center mb-6">
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
              Stress Level
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                result.level === 'High'
                  ? 'bg-gradient-to-r from-red-400 to-red-600'
                  : result.level === 'Moderate'
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                  : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
              }`}
              style={{ width: `${result.percentage}%` }}
            />
          </div>

          <div className="text-center mt-3 text-sm text-slate-400">
            {result.percentage}% Stress Intensity
          </div>

        </div>
      )}

    </div>
  </ModalWrapper>
);

}
