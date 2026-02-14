import { useState } from 'react';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import ModalWrapper from '../ui/ModalWrapper';

type Subject = {
  id: number;
  name: string;
  credits: string;
  marks: string;
};

type CGPAPredictorProps = {
  onClose: () => void;
};

export default function CGPAPredictor({ onClose }: CGPAPredictorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: '', credits: '', marks: '' },
  ]);
  const [result, setResult] = useState<{
    cgpa: number;
    contributions: { name: string; contribution: number }[];
  } | null>(null);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: Date.now(), name: '', credits: '', marks: '' },
    ]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id: number, field: keyof Subject, value: string) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calculateCGPA = () => {
    const validSubjects = subjects.filter(
      (s) => s.name && s.credits && s.marks
    );

    if (validSubjects.length === 0) {
      alert('Please add at least one complete subject');
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;
    const contributions: { name: string; contribution: number }[] = [];

    validSubjects.forEach((subject) => {
      const credits = parseFloat(subject.credits);
      const marks = parseFloat(subject.marks);

      let gradePoint = 0;
      if (marks >= 90) gradePoint = 10;
      else if (marks >= 80) gradePoint = 9;
      else if (marks >= 70) gradePoint = 8;
      else if (marks >= 60) gradePoint = 7;
      else if (marks >= 50) gradePoint = 6;
      else if (marks >= 40) gradePoint = 5;
      else gradePoint = 0;

      const points = gradePoint * credits;
      totalPoints += points;
      totalCredits += credits;

      contributions.push({
        name: subject.name,
        contribution: gradePoint,
      });
    });

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    setResult({
      cgpa: parseFloat(cgpa.toFixed(2)),
      contributions,
    });
  };

  return (
  <ModalWrapper
    title="CGPA Predictor"
    icon={<TrendingUp className="w-6 h-6 text-white" />}
    onClose={onClose}
  >
    <div className="space-y-6">

      {/* Subjects */}
      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div
            key={subject.id}
            className="bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-5 flex gap-4"
          >
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={subject.name}
                onChange={(e) =>
                  updateSubject(subject.id, 'name', e.target.value)
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder={`Subject ${index + 1} name`}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={subject.credits}
                  onChange={(e) =>
                    updateSubject(subject.id, 'credits', e.target.value)
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Credits"
                  min="0"
                />
                <input
                  type="number"
                  value={subject.marks}
                  onChange={(e) =>
                    updateSubject(subject.id, 'marks', e.target.value)
                  }
                  className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Marks"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {subjects.length > 1 && (
              <button
                onClick={() => removeSubject(subject.id)}
                className="self-start p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={addSubject}
          className="flex items-center space-x-2 px-4 py-2 border border-indigo-500 text-indigo-400 rounded-xl hover:bg-indigo-500/10 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Subject</span>
        </button>

        <button
          onClick={calculateCGPA}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl transition-all duration-200 active:scale-95"
        >
          Calculate CGPA
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">

          <h3 className="text-lg font-semibold text-white mb-6">
            Predicted CGPA
          </h3>

          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-indigo-400">
              {result.cgpa}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              out of 10.0
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h4 className="font-semibold text-white mb-3">
              Subject Grade Points
            </h4>

            <div className="space-y-2">
              {result.contributions.map((contrib, index) => (
                <div
                  key={index}
                  className="flex justify-between text-slate-300"
                >
                  <span>{contrib.name}</span>
                  <span className="font-medium text-indigo-400">
                    {contrib.contribution.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  </ModalWrapper>
);

}
