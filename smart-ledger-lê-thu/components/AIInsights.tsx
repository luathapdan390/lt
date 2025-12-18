
import React, { useState } from 'react';
import Button from './Button';
import { getFinancialAdvice } from '../services/geminiService';
import { Transaction } from '../types';

interface AIInsightsProps {
  transactions: Transaction[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    if (transactions.length === 0) {
      setAdvice("Record some transactions first so I can analyze your spending!");
      return;
    }
    setLoading(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold">Smart AI Insights</h2>
          <p className="text-white/70 text-sm">Powered by Gemini for your financial growth</p>
        </div>
      </div>

      {advice ? (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed">
            {advice}
          </div>
        </div>
      ) : (
        <p className="mb-8 text-indigo-100">
          Get personalized recommendations on how to save more money and optimize your monthly budget using artificial intelligence.
        </p>
      )}

      <Button 
        onClick={fetchAdvice} 
        loading={loading}
        className="bg-white text-indigo-700 hover:bg-indigo-50 border-none w-full sm:w-auto"
      >
        {advice ? 'Refresh Analysis' : 'Generate Advisor Insights'}
      </Button>
    </div>
  );
};

export default AIInsights;
