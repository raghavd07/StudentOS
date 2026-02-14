import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModalWrapperProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalWrapper({
  title,
  icon,
  onClose,
  children,
}: ModalWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      {/* Scroll Container */}
      <div className="min-h-screen flex items-start justify-center p-6 pt-20">
        
        {/* Radial Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_60%)] pointer-events-none"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-900/80 backdrop-blur-xl z-10">
            <div className="flex items-center space-x-4">
              {icon && (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md">
                  {icon}
                </div>
              )}
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                {title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 text-slate-300">
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
