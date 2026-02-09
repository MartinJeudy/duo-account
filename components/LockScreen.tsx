
import React, { useState } from 'react';
import { Lock, ShieldCheck, Delete } from 'lucide-react';

interface LockScreenProps {
  pinCode: string;
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ pinCode, onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    if (input.length < 4) {
      const newVal = input + num;
      setInput(newVal);
      if (newVal.length === 4) {
        if (newVal === pinCode) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setInput('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8">
      <div className="mb-12 flex flex-col items-center text-center space-y-4">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${error ? 'bg-red-500 animate-shake' : 'bg-indigo-600'}`}>
          <Lock size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">DuoAccount Scellé</h2>
          <p className="text-slate-400 text-sm mt-1">Saisissez votre code PIN pour accéder aux comptes.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
              input.length > i 
                ? 'bg-indigo-500 border-indigo-500 scale-125' 
                : 'border-slate-700'
            }`} 
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-[280px] w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'].map((val, idx) => (
          val === '' ? <div key={idx} /> : (
            <button
              key={val}
              onClick={() => handlePress(val)}
              className="w-16 h-16 rounded-full bg-slate-800 text-white text-2xl font-bold hover:bg-slate-700 active:bg-indigo-600 transition-all flex items-center justify-center shadow-lg"
            >
              {val}
            </button>
          )
        ))}
        <button 
          onClick={() => setInput(input.slice(0, -1))}
          className="w-16 h-16 rounded-full bg-slate-800/50 text-slate-400 flex items-center justify-center hover:text-white"
        >
          <Delete size={24} />
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default LockScreen;
