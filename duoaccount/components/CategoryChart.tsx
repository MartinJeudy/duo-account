
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense, Category } from '../types';

interface CategoryChartProps {
  expenses: Expense[];
}

const COLORS: Partial<Record<Category, string>> = {
  [Category.FOOD]: '#f97316',    
  [Category.TRANSPORT]: '#3b82f6', 
  [Category.HOUSING]: '#a855f7',   
  [Category.HEALTH]: '#ef4444',    
  [Category.SHOPPING]: '#ec4899',  
  [Category.LEISURE]: '#10b981',   
  [Category.OTHER]: '#64748b',     
};

const CategoryChart: React.FC<CategoryChartProps> = ({ expenses }) => {
  const data = useMemo(() => {
    const totals: Record<string, number> = {};
    // On ne compte que les dépenses réelles, pas les remboursements
    expenses.filter(e => e.category !== Category.REIMBURSEMENT).forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });

    return Object.keys(totals).map(cat => ({
      name: cat,
      value: totals[cat]
    })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  if (data.length === 0) return <div className="text-center text-slate-400 py-12 italic border-2 border-dashed border-slate-100 rounded-3xl">Aucune dépense commune ce mois.</div>;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as Category] || '#CBD5E1'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)}€`, 'Total']}
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
