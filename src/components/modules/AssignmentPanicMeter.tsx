import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import ModalWrapper from '../ui/ModalWrapper';

type AssignmentPanicMeterProps = {
  onClose: () => void;
};

export default function AssignmentPanicMeter({
  onClose,
}: AssignmentPanicMeterProps) {
  const [deadline, setDeadline] = useState('');
  const [completion, setCompletion] = useState('');
  const [result, setResult] = useState<{
    level: string;
    hoursRemaining: number;
    color: string;
  } | null>(null);

  const calculatePanic = () => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const completionPercent = parseFloat(completion);

    if (isNaN(completionPercent) || !deadline) {
      alert('Please enter valid data');
      return;
    }

    const hoursRemaining = Math.max(
      0,
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    );
    const remainingWork = 100 - completionPercent;

    let panicLevel = 'Low';
    let color = 'green';

    if (hoursRemaining < 12 && remainingWork > 50) {
      panicLevel = 'High';
      color = 'red';
    } else if (hoursRemaining < 24 && remainingWork > 30) {
      panicLevel = 'High';
      color = 'red';
    } else if (hoursRemaining < 48 && remainingWork > 20) {
      panicLevel = 'Medium';
      color = 'orange';
    } else if (remainingWork > 50) {
      panicLevel = 'Medium';
      color = 'orange';
    }

    setResult({
      level: panicLevel,
      hoursRemaining: Math.round(hoursRemaining),
      color,
    });
  };


return (
  <ModalWrapper
    title="Assignment Panic Meter"
    icon={<AlertCircle className="w-6 h-6 text-white" />}
    onClose={onClose}
  >
    <div className="space-y-6">

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Assignment Deadline
        </label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Completion */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Completion Percentage
        </label>
        <input
          type="number"
          value={completion}
          onChange={(e) => setCompletion(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter completion %"
          min="0"
          max="100"
        />
      </div>

      {/* Button */}
      <button
        onClick={calculatePanic}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95"
      >
        Calculate Panic Level
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">

          <h3 className="text-lg font-semibold text-white mb-6">
            Panic Assessment
          </h3>

          {/* Panic Level */}
          <div className="text-center mb-6">
            <div
              className={`text-4xl font-bold ${
                result.level === 'High'
                  ? 'text-red-400'
                  : result.level === 'Medium'
                  ? 'text-orange-400'
                  : 'text-emerald-400'
              }`}
            >
              {result.level}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Panic Level
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3 text-slate-300">
            <div className="flex justify-between">
              <span>Time Remaining:</span>
              <span className="font-medium text-indigo-400">
                {result.hoursRemaining} hours
              </span>
            </div>

            <div className="flex justify-between">
              <span>Completion Status:</span>
              <span className="font-medium text-indigo-400">
                {completion}%
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  </ModalWrapper>
);

}
