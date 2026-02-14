import { useState } from 'react';
import { Calendar } from 'lucide-react';
import ModalWrapper from '../ui/ModalWrapper';

type AttendancePlannerProps = {
  onClose: () => void;
};

export default function AttendancePlanner({ onClose }: AttendancePlannerProps) {
  const [currentAttendance, setCurrentAttendance] = useState('');
  const [conductedClasses, setConductedClasses] = useState('');
  const [upcomingClasses, setUpcomingClasses] = useState('');
  const [result, setResult] = useState<{
    allowableAbsences: number;
    remainingMargin: number;
    currentPercentage: number;
  } | null>(null);

  const calculateAttendance = () => {
    const current = parseFloat(currentAttendance);
    const conducted = parseInt(conductedClasses);
    const upcoming = parseInt(upcomingClasses);

    if (isNaN(current) || isNaN(conducted) || isNaN(upcoming)) {
      alert('Please enter valid numbers');
      return;
    }

    const attendedClasses = Math.round((current / 100) * conducted);
    const totalClasses = conducted + upcoming;
    const requiredAttendance = 0.75;

    let allowableAbsences = 0;
    for (let absences = 0; absences <= upcoming; absences++) {
      const futureAttendance = (attendedClasses + (upcoming - absences)) / totalClasses;
      if (futureAttendance >= requiredAttendance) {
        allowableAbsences = absences;
      } else {
        break;
      }
    }

    const finalAttendance = ((attendedClasses + (upcoming - allowableAbsences)) / totalClasses) * 100;
    const margin = finalAttendance - 75;

    setResult({
      allowableAbsences,
      remainingMargin: parseFloat(margin.toFixed(2)),
      currentPercentage: current,
    });
  };

  

return (
  <ModalWrapper
    title="Attendance Planner"
    icon={<Calendar className="w-6 h-6 text-white" />}
    onClose={onClose}
  >
    <div className="space-y-6">

      {/* Current Attendance */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Current Attendance Percentage
        </label>
        <input
          type="number"
          value={currentAttendance}
          onChange={(e) => setCurrentAttendance(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter current attendance %"
          min="0"
          max="100"
        />
      </div>

      {/* Conducted Classes */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Total Conducted Classes
        </label>
        <input
          type="number"
          value={conductedClasses}
          onChange={(e) => setConductedClasses(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter number of conducted classes"
          min="0"
        />
      </div>

      {/* Upcoming Classes */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Total Upcoming Classes
        </label>
        <input
          type="number"
          value={upcomingClasses}
          onChange={(e) => setUpcomingClasses(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter number of upcoming classes"
          min="0"
        />
      </div>

      {/* Button */}
      <button
        onClick={calculateAttendance}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95"
      >
        Calculate Attendance Plan
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Attendance Analysis
          </h3>

          <div className="space-y-3 text-slate-300">
            <div className="flex justify-between">
              <span>Current Attendance:</span>
              <span className="text-indigo-400 font-medium">
                {result.currentPercentage}%
              </span>
            </div>

            <div className="flex justify-between">
              <span>Allowable Absences:</span>
              <span className="text-indigo-400 font-medium">
                {result.allowableAbsences} classes
              </span>
            </div>

            <div className="flex justify-between">
              <span>Remaining Margin:</span>
              <span className="text-indigo-400 font-medium">
                {result.remainingMargin}%
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  </ModalWrapper>
);

}
