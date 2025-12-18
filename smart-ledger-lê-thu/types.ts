
export interface Transaction {
  id: string;
  income: string;
  expense: string;
  explanation: string;
  date: string;
  category: string;
}

export interface ApiTransaction {
  income: string;
  expense: string;
  explanation: string;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}
