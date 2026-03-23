import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Login from './components/Login';
import Signup from './components/Signup';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('login');
  const [showForm, setShowForm] = useState(false);
  const[userName, setUserName] = useState(localStorage.getItem('userName') || 'User');

  // 1. Transactions State
  const [transactions, setTransactions] = useState([]);

  // Form Inputs State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [searchTerm, setSearchTerm] = useState('');

  // Database se data laane ke liye
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('https://spendwise-backend-u4nz.onrender.com', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    if (isLoggedIn) fetchTransactions();
  }, [isLoggedIn]);

  const addTransaction = async () => {
    if (!name || !amount) return alert("Please fill all fields!");

    const token = localStorage.getItem('token');
    const newTransaction = {
      name,
      amount: parseInt(amount),
      category,
      type,
      date: new Date().toLocaleDateString(),
      emoji: type === 'income' ? "💰" : "💸"
    };

    try {
      const res = await axios.post('http://localhost:5000/api/transaction/add', newTransaction, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Database se aayi nayi transaction ko list mein add karein
      setTransactions([res.data, ...transactions]);
      setName(''); setAmount(''); setShowForm(false);
    } catch (err) {
      alert("Failed to save transaction ❌");
    }
  };

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem('token');
    try {
      // URL ko dhyan se check karein (backticks ke andar)
      await axios.delete(`http://localhost:5000/api/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Frontend list se hataiye
      setTransactions(transactions.filter(t => t._id !== id));
      alert("Transaction removed ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to delete ❌");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
  };

  // Chart Data
  const chartData = [
    { name: 'Income', value: transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) },
    { name: 'Expense', value: transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) }
  ];
  // Total Calculation Logic
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar onAddClick={() => setShowForm(true)} />

      {!isLoggedIn ? (
        /* --- AUTH SECTION (LOGIN/SIGNUP) --- */
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            {currentPage === 'login' ? (
              <>
                <Login onLoginSuccess={() => setIsLoggedIn(true)} />
                <div className="mt-6 text-center text-slate-500">
                  Don't have an account?
                  <button onClick={() => setCurrentPage('signup')} className="ml-2 text-emerald-600 font-bold hover:underline">Sign Up</button>
                </div>
              </>
            ) : (
              <>
                <Signup onSignupSuccess={() => setCurrentPage('login')} />
                <div className="mt-6 text-center text-slate-500">
                  Already have an account?
                  <button onClick={() => setCurrentPage('login')} className="ml-2 text-emerald-600 font-bold hover:underline">Login</button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* --- PROFESSIONAL DASHBOARD SECTION --- */
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800">
                Welcome back, {userName}! 🚀
              </h1>
              <p className="text-slate-500 mt-1">Here's what's happening with your money.</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-rose-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Logout</span>
            </button>
          </div>

          {/* --- STATS CARDS SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Balance Card */}
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-100 text-white">
              <p className="text-emerald-100 font-medium">Total Balance</p>
              <h2 className="text-3xl font-extrabold mt-1">₹{netBalance.toLocaleString()}</h2>
            </div>

            {/* Total Income Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Total Income
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">₹{totalIncome.toLocaleString()}</h2>
            </div>

            {/* Total Expense Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Total Expense
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1 text-rose-500">₹{totalExpense.toLocaleString()}</h2>
            </div>
          </div>

          {/* Quick Actions & Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
            >
              {showForm ? "✕ Close Form" : "+ Add New Transaction"}
            </button>
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search transactions..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Transaction Form (Animated Card) */}
          {showForm && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 mb-10 animate-in slide-in-from-top duration-500">
              <h3 className="text-xl font-bold mb-6 text-slate-700">Enter Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input type="text" placeholder="Transaction Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="Food">Food 🍲</option>
                  <option value="Work">Work 💰</option>
                  <option value="Shopping">Shopping 🛍️</option>
                  <option value="Rent">Rent 🏠</option>
                </select>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="expense">Expense 💸</option>
                  <option value="income">Income 💰</option>
                </select>
                <button onClick={addTransaction} className="w-full bg-slate-900 text-white font-bold p-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Save Record</button>
              </div>
            </div>
          )}

          {/* Dashboard Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Chart Card */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
              <h3 className="text-xl font-bold text-slate-700 self-start mb-2">Spending Analysis</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={8} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List Card */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-700">Recent Transactions</h3>
                <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-medium">{transactions.length} total</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {transactions
                  .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(t => (
                    <div key={t._id || t.id} className="group flex justify-between items-center p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-2xl shadow-sm group-hover:scale-110 transition-transform">
                          {t.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{t.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{t.date} • {t.category}</p>
                        </div>
                      </div>
                      <p className={`text-lg font-extrabold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                      </p>
                      <button
                        onClick={() => deleteTransaction(t._id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;