
import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 012 2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <p className="text-gray-500">No transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Last {transactions.length} entries</span>
      </div>
      <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
        {sorted.map((tx) => (
          <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.income ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {tx.income ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{tx.explanation}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{tx.category}</span>
                  <span>•</span>
                  <span>{new Date(tx.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className={`text-sm font-bold ${tx.income ? 'text-emerald-600' : 'text-red-600'}`}>
              {tx.income ? '+' : '-'}{Number(tx.income || tx.expense).toLocaleString()} ₫
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
