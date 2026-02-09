
export type User = 'Martin' | 'Joséphine';

export enum Category {
  FOOD = 'Alimentation',
  TRANSPORT = 'Transport',
  HOUSING = 'Logement',
  LEISURE = 'Loisirs',
  HEALTH = 'Santé',
  SHOPPING = 'Shopping',
  REIMBURSEMENT = 'Remboursement',
  OTHER = 'Autres'
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  date: string; // ISO format
  paidBy: User;
  category: Category;
}

export interface AppSettings {
  duoId: string;
  pinCode: string;
  isLocked: boolean;
  lastSync?: string;
}

export interface MonthlyStats {
  total: number;
  martinPaid: number;
  josephinePaid: number;
  balance: number; 
}
