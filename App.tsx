
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Users, 
  PieChart as PieChartIcon, 
  List, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  HandCoins,
  Settings as SettingsIcon,
  Cloud,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Expense, User, Category, AppSettings } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseItem from './components/ExpenseItem';
import SummaryCard from './components/SummaryCard';
import CategoryChart from './components/CategoryChart';
import SettingsPanel from './components/SettingsPanel';
import LockScreen from './components/LockScreen';
import { supabase, TABLE_NAME } from './lib/supabase';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('duo_settings');
    return saved ? JSON.parse(saved) : {
      duoId: 'martin-josephine-' + Math.floor(Math.random() * 10000),
      pinCode: '',
      isLocked: false
    };
  });
  
  const [currentUser, setCurrentUser] = useState<User>('Martin');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('duo_id', settings.duoId)
        .order('date', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const mappedData: Expense[] = data.map(item => ({
          id: item.id,
          label: item.label,
          amount: item.amount,
          date: item.date,
          paidBy: item.paid_by as User,
          category: item.category as Category
        }));
        setExpenses(mappedData);
        setIsOnline(true);
      }
    } catch (err) {
      console.warn('Supabase non configuré ou hors ligne');
      setIsOnline(false);
      const saved = localStorage.getItem('duo_expenses');
      if (saved) setExpenses(JSON.parse(saved));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    const channel = supabase
      .channel('duo-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME, filter: `duo_id=eq.${settings.duoId}` },
        () => fetchExpenses()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [settings.duoId]);

  useEffect(() => {
    localStorage.setItem('duo_settings', JSON.stringify(settings));
    // Cache current expenses locally as backup
    if (expenses.length > 0) {
      localStorage.setItem('duo_expenses', JSON.stringify(expenses));
    }
  }, [settings, expenses]);

  const calculateBalance = (expenseList: Expense[]) => {
    const sharedExpenses = expenseList.filter(e => e.category !== Category.REIMBURSEMENT);
    const martinPaid = expenseList
      .filter(e => e.paidBy === 'Martin' && e.category !== Category.REIMBURSEMENT)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const josephinePaid = expenseList
      .filter(e => e.paidBy === 'Joséphine' && e.category !== Category.REIMBURSEMENT)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const rembByJosephine = expenseList
      .filter(e => e.paidBy === 'Joséphine' && e.category === Category.REIMBURSEMENT)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const rembByMartin = expenseList
      .filter(e => e.paidBy === 'Martin' && e.category === Category.REIMBURSEMENT)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const currentBalance = ((martinPaid - josephinePaid) / 2) - rembByJosephine + rembByMartin;
    const totalShared = sharedExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    return { totalShared, martinPaid, josephinePaid, balance: currentBalance };
  };

  const globalStats = useMemo(() => calculateBalance(expenses), [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentDate.getMonth() && 
             expDate.getFullYear() === currentDate.getFullYear();
    });
  }, [expenses, currentDate]);

  const monthlyStats = useMemo(() => calculateBalance(filteredExpenses), [filteredExpenses]);

  const addOrUpdateExpense = async (expenseData: Omit<Expense, 'id'>) => {
    const payload = {
      label: expenseData.label,
      amount: expenseData.amount,
      date: expenseData.date,
      paid_by: expenseData.paidBy,
      category: expenseData.category,
      duo_id: settings.duoId
    };

    try {
      if (editingExpense?.id) {
        const { error } = await supabase.from(TABLE_NAME).update(payload).eq('id', editingExpense.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(TABLE_NAME).insert([payload]);
        if (error) throw error;
      }
      setIsFormOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      alert("Erreur Cloud. Vos clés Supabase sont-elles configurées dans lib/supabase.ts ?");
    }
  };

  const deleteExpense = async (id: string) => {
    if (!window.confirm('Supprimer cette opération ?')) return;
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
      if (error) throw error;
      fetchExpenses();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (settings.isLocked && settings.pinCode) {
    return <LockScreen pinCode={settings.pinCode} onUnlock={() => setSettings(s => ({...s, isLocked: false}))} />;
  }

  const changeMonth = (offset: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + offset);
    setCurrentDate(nextDate);
  };

  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <CreditCard size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-slate-800 leading-none">DuoAccount</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Sync Martin & Joséphine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
              {isOnline ? <Wifi size={12} className="animate-pulse-green" /> : <WifiOff size={12} />}
              <span className="hidden xs:inline">{isOnline ? 'CLOUD CONNECTÉ' : 'MODE LOCAL'}</span>
            </div>
            
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
              <SettingsIcon size={20} />
            </button>

            <button 
              onClick={() => setCurrentUser(prev => prev === 'Martin' ? 'Joséphine' : 'Martin')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700 border border-slate-200"
            >
              <Users size={14} />
              <span>{currentUser}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {isLoading && isOnline && (
          <div className="text-center py-2 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg animate-pulse uppercase tracking-widest">
            Mise à jour Cloud...
          </div>
        )}

        {Math.abs(globalStats.balance) > 0.01 && (
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <HandCoins size={32} />
              </div>
              <div>
                <p className="text-indigo-100 text-sm font-medium">Balance globale</p>
                <h2 className="text-xl font-bold">
                  {globalStats.balance > 0 ? "Joséphine doit " : "Martin doit "} 
                  <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-lg mx-1">{Math.abs(globalStats.balance).toFixed(2)}€</span>
                  {globalStats.balance > 0 ? " à Martin" : " à Joséphine"}
                </h2>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingExpense({
                  id: '',
                  label: 'Remboursement de la dette',
                  amount: Math.abs(globalStats.balance),
                  date: new Date().toISOString().split('T')[0],
                  paidBy: globalStats.balance > 0 ? 'Joséphine' : 'Martin',
                  category: Category.REIMBURSEMENT
                });
                setIsFormOpen(true);
              }}
              className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg whitespace-nowrap"
            >
              Régler maintenant
            </button>
          </div>
        )}

        <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-slate-700 capitalize">{monthName}</span>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard title="Dépenses Communes" value={monthlyStats.totalShared} color="bg-slate-800" icon={<TrendingUp size={20} />} />
          <SummaryCard 
            title="Balance du Mois" 
            value={Math.abs(monthlyStats.balance)} 
            subtitle={monthlyStats.balance > 0 ? "Joséphine doit à Martin" : monthlyStats.balance < 0 ? "Martin doit à Joséphine" : "Tout est équilibré"}
            color={monthlyStats.balance === 0 ? "bg-emerald-500" : "bg-indigo-500"}
            icon={<Users size={20} />}
          />
          <div className="hidden lg:block">
             <SummaryCard title="Payé par Martin" value={monthlyStats.martinPaid} color="bg-blue-500" icon={<div className="font-bold text-xs">M</div>} />
          </div>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => setActiveTab('list')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-400'}`}>
            <List size={18} /> Liste
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-400'}`}>
            <PieChartIcon size={18} /> Stats
          </button>
        </div>

        {activeTab === 'list' ? (
          <div className="space-y-3">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map(expense => (
                <ExpenseItem 
                  key={expense.id} 
                  expense={expense} 
                  onDelete={deleteExpense} 
                  onEdit={(exp) => { setEditingExpense(exp); setIsFormOpen(true); }} 
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                <p>Aucune dépense ce mois-ci.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Répartition</h3>
            <CategoryChart expenses={filteredExpenses} />
          </div>
        )}
      </main>

      <button 
        onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30"
      >
        <Plus size={32} />
      </button>

      {isFormOpen && (
        <ExpenseForm 
          onClose={() => { setIsFormOpen(false); setEditingExpense(null); }}
          onSubmit={addOrUpdateExpense}
          initialData={editingExpense || undefined}
          defaultUser={currentUser}
          currentDate={currentDate}
        />
      )}

      {isSettingsOpen && (
        <SettingsPanel 
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setIsSettingsOpen(false)}
          expenses={expenses}
          onImportExpenses={setExpenses}
        />
      )}
    </div>
  );
};

export default App;
