
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import { logTransactionToSheets } from './services/apiService';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<'dashboard' | 'transactions'>('dashboard');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('finance_ledger');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save to local storage when transactions change
  useEffect(() => {
    localStorage.setItem('finance_ledger', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = async (data: { income: string, expense: string, explanation: string, category: string }) => {
    // 1. Create the new transaction object for local state
    const newTx: Transaction = {
      id: Date.now().toString(),
      income: data.income,
      expense: data.expense,
      explanation: data.explanation,
      category: data.category,
      date: new Date().toISOString()
    };

    // 2. Add to local state first for immediate UI update
    setTransactions(prev => [newTx, ...prev]);

    // 3. Log to external API (Google Sheets)
    await logTransactionToSheets({
      income: data.income,
      expense: data.expense,
      explanation: data.explanation
    });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-1c.538-.1 1.074-.242 1.584-.438M12 16h-.01M9 16H8a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2h-10" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Smart Ledger <span className="text-blue-600">Lê Thu</span></h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('transactions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'transactions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Transactions
            </button>
          </div>

          <div className="sm:hidden">
             {/* Simple mobile toggle */}
             <select 
               value={view} 
               onChange={(e) => setView(e.target.value as any)}
               className="bg-gray-100 border-none rounded-lg py-1 px-3 text-sm font-medium outline-none"
             >
               <option value="dashboard">Dashboard</option>
               <option value="transactions">Activity</option>
             </select>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form and AI (Sticky on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24">
              <TransactionForm onAdd={handleAddTransaction} />
              <div className="mt-6">
                <AIInsights transactions={transactions} />
              </div>
            </div>
          </div>

          {/* Right Column: Dashboards and Lists */}
          <div className="lg:col-span-8 space-y-8">
            {view === 'dashboard' ? (
              <>
                <Dashboard transactions={transactions} />
                <div className="block lg:hidden">
                   <TransactionList transactions={transactions.slice(0, 5)} />
                </div>
              </>
            ) : (
              <TransactionList transactions={transactions} />
            )}
            
            {/* Always show a glimpse of recent items on the side in dashboard mode for wide screens */}
            {view === 'dashboard' && (
              <div className="hidden lg:block">
                <TransactionList transactions={transactions.slice(0, 10)} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <button 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-14 h-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;
