
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Transaction, FinancialStats, CategoryData } from '../types';
import { CATEGORIES, MOCK_HISTORICAL_DATA } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats: FinancialStats = transactions.reduce((acc, tx) => {
    const inc = Number(tx.income) || 0;
    const exp = Number(tx.expense) || 0;
    return {
      totalIncome: acc.totalIncome + inc,
      totalExpense: acc.totalExpense + exp,
      balance: acc.balance + (inc - exp)
    };
  }, { totalIncome: 0, totalExpense: 0, balance: 0 });

  const categoryData: CategoryData[] = CATEGORIES.map(cat => {
    const value = transactions
      .filter(tx => tx.category === cat.name && tx.expense)
      .reduce((sum, tx) => sum + Number(tx.expense), 0);
    return { name: cat.name, value, color: cat.color };
  }).filter(c => c.value > 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-gray-800">{stats.balance.toLocaleString()} ₫</p>
          <div className="mt-2 text-xs text-blue-500 font-medium">Net Worth</div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-emerald-600 text-sm font-medium mb-1">Total Income</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.totalIncome.toLocaleString()} ₫</p>
          <div className="mt-2 text-xs text-emerald-600 font-medium">↑ Monthly Growth</div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
          <p className="text-red-600 text-sm font-medium mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700">{stats.totalExpense.toLocaleString()} ₫</p>
          <div className="mt-2 text-xs text-red-600 font-medium">↓ Spending Habits</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Monthly Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Expense Categories</h3>
          <div className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                No expense data to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
