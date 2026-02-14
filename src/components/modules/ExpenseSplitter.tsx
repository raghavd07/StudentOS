import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import ModalWrapper from '../ui/ModalWrapper';

type ExpenseSplitterProps = {
  onClose: () => void;
};

export default function ExpenseSplitter({ onClose }: ExpenseSplitterProps) {
  const [totalAmount, setTotalAmount] = useState('');
  const [numParticipants, setNumParticipants] = useState('');
  const [result, setResult] = useState<{
    sharePerPerson: number;
  } | null>(null);

  const calculateSplit = () => {
    const amount = parseFloat(totalAmount);
    const participants = parseInt(numParticipants);

    if (isNaN(amount) || isNaN(participants) || participants <= 0) {
      alert('Please enter valid numbers');
      return;
    }

    const sharePerPerson = amount / participants;

    setResult({
      sharePerPerson: parseFloat(sharePerPerson.toFixed(2)),
    });
  };

  return (
    <ModalWrapper
      title="Expense Splitter"
      icon={<DollarSign className="w-6 h-6 text-white" />}
      onClose={onClose}
    >
      <div className="space-y-6">

        {/* Total Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Total Amount (₹)
          </label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Enter total amount"
            min="0"
            step="0.01"
          />
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Number of Participants
          </label>
          <input
            type="number"
            value={numParticipants}
            onChange={(e) => setNumParticipants(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            placeholder="Enter number of people"
            min="1"
          />
        </div>

        {/* Button */}
        <button
          onClick={calculateSplit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95"
        >
          Calculate Split
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-slate-800/70 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">

            <h3 className="text-lg font-semibold text-white mb-6">
              Split Result
            </h3>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-indigo-400">
                ₹{result.sharePerPerson}
              </div>
              <div className="text-sm text-slate-400 mt-2">
                per person
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium text-indigo-400">
                  ₹{totalAmount}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Participants:</span>
                <span className="font-medium text-indigo-400">
                  {numParticipants}
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </ModalWrapper>
  );
}
