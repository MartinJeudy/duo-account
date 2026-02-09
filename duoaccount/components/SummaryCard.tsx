
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  subtitle?: string;
  color: string;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, color, icon }) => {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <div className={`p-2 rounded-xl text-white ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-slate-800">{value.toFixed(2)}€</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SummaryCard;
