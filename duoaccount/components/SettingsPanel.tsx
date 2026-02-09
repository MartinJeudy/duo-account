
import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Cloud, Download, Upload, Share2, Info, Settings as SettingsIcon, Database, Link } from 'lucide-react';
import { AppSettings, Expense } from '../types';
import { supabase, TABLE_NAME } from '../lib/supabase';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onClose: () => void;
  expenses: Expense[];
  onImportExpenses: (e: Expense[]) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, onClose, expenses, onImportExpenses }) => {
  const [pinInput, setPinInput] = useState(settings.pinCode);
  const [duoIdInput, setDuoIdInput] = useState(settings.duoId);
  const [isMigrating, setIsMigrating] = useState(false);

  const handleExport = () => {
    const data = JSON.stringify({ expenses, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duoaccount-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.expenses) {
          onImportExpenses(data.expenses);
          alert('Données importées localement !');
        }
      } catch (err) {
        alert('Fichier invalide.');
      }
    };
    reader.readAsText(file);
  };

  const syncToCloud = async () => {
    if (!window.confirm("Voulez-vous envoyer vos dépenses locales vers le Cloud ? Cela peut créer des doublons si vous l'avez déjà fait.")) return;
    
    setIsMigrating(true);
    try {
      const payload = expenses.map(e => ({
        label: e.label,
        amount: e.amount,
        date: e.date,
        paid_by: e.paidBy,
        category: e.category,
        duo_id: settings.duoId
      }));

      const { error } = await supabase.from(TABLE_NAME).insert(payload);
      if (error) throw error;
      alert("Migration réussie ! Vos données sont maintenant sur Supabase.");
    } catch (err) {
      alert("Erreur lors de la migration Cloud.");
      console.error(err);
    } finally {
      setIsMigrating(false);
    }
  };

  const saveSettings = () => {
    onUpdateSettings({ 
      ...settings, 
      pinCode: pinInput,
      duoId: duoIdInput 
    });
    alert('Paramètres mis à jour !');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SettingsIcon size={20} className="text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-800">Compte & Sécurité</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Section Cloud */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Cloud size={14} /> Synchronisation Cloud
            </h4>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-[10px] text-indigo-700 font-bold uppercase mb-2">
                Identifiant DuoID (à partager avec votre partenaire) :
              </p>
              <div className="flex items-center gap-2 mb-3">
                <input 
                  type="text"
                  value={duoIdInput}
                  onChange={(e) => setDuoIdInput(e.target.value)}
                  className="flex-1 bg-white p-3 rounded-xl border border-indigo-200 font-mono text-sm text-indigo-800 outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button 
                  onClick={() => { navigator.clipboard.writeText(duoIdInput); alert('Code copié !'); }}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  title="Copier l'identifiant"
                >
                  <Share2 size={18} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 italic mb-4">
                Pour être sur le même compte que Joséphine, entrez ici le même DuoID qu'elle.
              </p>
              
              <button 
                onClick={syncToCloud}
                disabled={isMigrating}
                className="w-full py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50"
              >
                <Database size={14} />
                {isMigrating ? "Migration en cours..." : "Pousser les données locales vers le Cloud"}
              </button>
            </div>
          </section>

          {/* Section Sécurité */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Lock size={14} /> Sécurité (PIN)
            </h4>
            <div className="space-y-3">
              <input 
                type="password" 
                maxLength={4}
                placeholder="Nouveau code PIN (4 chiffres)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none transition-all"
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </section>

          <button 
            onClick={saveSettings}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <ShieldCheck size={18} />
            Enregistrer les modifications
          </button>

          {/* Section Export/Import */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Download size={14} /> Secours (JSON)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleExport}
                className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl font-bold text-xs flex flex-col items-center gap-2 hover:bg-emerald-100 transition-all"
              >
                <Download size={20} />
                Exporter
              </button>
              <label className="p-4 bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl font-bold text-xs flex flex-col items-center gap-2 hover:bg-blue-100 transition-all cursor-pointer">
                <Upload size={20} />
                Importer
                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
