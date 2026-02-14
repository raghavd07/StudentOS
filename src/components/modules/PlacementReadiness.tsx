import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import ModalWrapper from '../ui/ModalWrapper';

type PlacementReadinessProps = {
  onClose: () => void;
};

export default function PlacementReadiness({
  onClose,
}: PlacementReadinessProps) {
  const [dsaLevel, setDsaLevel] = useState('');
  const [numProjects, setNumProjects] = useState('');
  const [projectQuality, setProjectQuality] = useState('');
  const [resumeReadiness, setResumeReadiness] = useState('');
  const [mockTestScore, setMockTestScore] = useState('');
  const [result, setResult] = useState<{
    percentage: number;
    breakdown: {
      dsa: number;
      projects: number;
      resume: number;
      tests: number;
    };
  } | null>(null);

  const calculateReadiness = () => {
    const dsa = parseFloat(dsaLevel);
    const projects = parseInt(numProjects);
    const quality = parseFloat(projectQuality);
    const resume = parseFloat(resumeReadiness);
    const tests = parseFloat(mockTestScore);

    if (
      isNaN(dsa) ||
      isNaN(projects) ||
      isNaN(quality) ||
      isNaN(resume) ||
      isNaN(tests)
    ) {
      alert('Please enter valid numbers');
      return;
    }

    const dsaScore = (dsa / 100) * 30;

    let projectScore = Math.min(projects * 3, 15);
    const qualityMultiplier = quality / 100;
    projectScore = projectScore * qualityMultiplier;
    projectScore = (projectScore / 15) * 25;

    const resumeScore = (resume / 100) * 20;
    const testScore = (tests / 100) * 25;

    const totalPercentage =
      dsaScore + projectScore + resumeScore + testScore;

    setResult({
      percentage: Math.round(totalPercentage),
      breakdown: {
        dsa: Math.round(dsaScore),
        projects: Math.round(projectScore),
        resume: Math.round(resumeScore),
        tests: Math.round(testScore),
      },
    });
  };

  return (
    <ModalWrapper
      title="Placement Readiness Meter"
      icon={<Briefcase className="w-6 h-6 text-white" />}
      onClose={onClose}
    >
      <div className="space-y-6">

        {/* Inputs */}
        {[
          {
            label: 'DSA Preparedness Level (0-100)',
            value: dsaLevel,
            setter: setDsaLevel,
            placeholder: 'Rate your DSA knowledge',
          },
          {
            label: 'Number of Projects',
            value: numProjects,
            setter: setNumProjects,
            placeholder: 'Enter number of projects',
          },
          {
            label: 'Project Quality Rating (0-100)',
            value: projectQuality,
            setter: setProjectQuality,
            placeholder: 'Rate overall project quality',
          },
          {
            label: 'Resume Readiness (0-100)',
            value: resumeReadiness,
            setter: setResumeReadiness,
            placeholder: 'Rate your resume quality',
          },
          {
            label: 'Mock Test Average Score (0-100)',
            value: mockTestScore,
            setter: setMockTestScore,
            placeholder: 'Average mock test score',
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
              min="0"
              max="100"
            />
          </div>
        ))}

        {/* Button */}
        <button
          onClick={calculateReadiness}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95"
        >
          Calculate Placement Readiness
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">

            <h3 className="text-lg font-semibold text-white mb-6">
              Placement Readiness
            </h3>

            {/* Overall Score */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-indigo-400">
                {result.percentage}%
              </div>
              <div className="text-sm text-slate-400 mt-1">
                Overall Readiness
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-700"
                style={{ width: `${result.percentage}%` }}
              />
            </div>

            {/* Breakdown */}
            <div className="border-t border-slate-700 pt-4">
              <h4 className="font-semibold text-white mb-4">
                Component Breakdown
              </h4>

              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>DSA Skills:</span>
                  <span className="font-medium text-indigo-400">
                    {result.breakdown.dsa}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Projects:</span>
                  <span className="font-medium text-indigo-400">
                    {result.breakdown.projects}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Resume:</span>
                  <span className="font-medium text-indigo-400">
                    {result.breakdown.resume}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Mock Tests:</span>
                  <span className="font-medium text-indigo-400">
                    {result.breakdown.tests}%
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
