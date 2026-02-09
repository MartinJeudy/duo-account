
import React from 'react';
import { Trash2, Edit3, ShoppingBag, Utensils, Car, Home, Heart, MoreHorizontal, Package, HandCoins } from 'lucide-react';
import { Expense, Category } from '../types';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const getCategoryIcon = (category: Category) => {
  switch (category) {
    case Category.FOOD: return <Utensils size={18} />;
    case Category.TRANSPORT: return <Car size={18} />;
    case Category.HOUSING: return <Home size={18} />;
    case Category.HEALTH: return <Heart size={18} />;
    case Category.SHOPPING: return <ShoppingBag size={18} />;
    case Category.LEISURE: return <Package size={18} />;
    case Category.REIMBURSEMENT: return <HandCoins size={18} />;
    default: return <MoreHorizontal size={18} />;
  }
};

const getCategoryColor = (category: Category) => {
  switch (category) {
    case Category.FOOD: return 'bg-orange-100 text-orange-600';
    case Category.TRANSPORT: return 'bg-blue-100 text-blue-600';
    case Category.HOUSING: return 'bg-purple-100 text-purple-600';
    case Category.HEALTH: return 'bg-red-100 text-red-600';
    case Category.SHOPPING: return 'bg-pink-100 text-pink-600';
    case Category.LEISURE: return 'bg-emerald-100 text-emerald-600';
    case Category.REIMBURSEMENT: return 'bg-indigo-600 text-white shadow-md shadow-indigo-100';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete, onEdit }) => {
  const date = new Date(expense.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const isReimbursement = expense.category === Category.REIMBURSEMENT;

  return (
    <div className={`group p-4 rounded-2xl shadow-sm border transition-all flex items-center gap-4 ${isReimbursement ? 'bg-indigo-50/50 border-indigo-100 border-dashed' : 'bg-white border-slate-100 hover:border-indigo-200'}`}>
      <div className={`p-3 rounded-xl flex-shrink-0 ${getCategoryColor(expense.category)}`}>
        {getCategoryIcon(expense.category)}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold truncate ${isReimbursement ? 'text-indigo-900' : 'text-slate-800'}`}>
          {expense.label}
          {isReimbursement && <span className="ml-2 text-[10px] bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-widest font-black">Transfert</span>}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold text-slate-400">{date}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${isReimbursement ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
            {expense.paidBy}
          </span>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <span className={`font-bold ${isReimbursement ? 'text-indigo-600 text-lg' : 'text-slate-900'}`}>{expense.amount.toFixed(2)}€</span>
        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(expense)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => onDelete(expense.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
