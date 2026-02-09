
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Expense, Category, User } from '../types';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  initialData?: Expense;
  defaultUser: User;
  currentDate: Date;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSubmit, initialData, defaultUser, currentDate }) => {
  const [label, setLabel] = useState(initialData?.label || '');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<Category>(initialData?.category || Category.FOOD);
  const [paidBy, setPaidBy] = useState<User>(initialData?.paidBy || defaultUser);
  
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(initialData?.date || formatDateForInput(currentDate));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !amount) return;

    onSubmit({
      label,
      amount: parseFloat(amount),
      category,
      paidBy,
      date
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? 'Modifier la dépense' : 'Nouvelle dépense'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Libellé</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Courses Carrefour"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              value={label}
              onChange={e => setLabel(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Montant (€)</label>
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Catégorie</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Object.values(Category).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all border ${
                    category === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payé par</label>
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              {(['Martin', 'Joséphine'] as User[]).map(user => (
                <button
                  key={user}
                  type="button"
                  onClick={() => setPaidBy(user)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    paidBy === user ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {user}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Check size={20} />
            {initialData ? 'Enregistrer les modifications' : 'Ajouter la dépense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
