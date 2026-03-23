import React from 'react'

const Navbar = ({ onAddClick }) => { 
  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-10 border-b border-gray-100">
      <h1 className="text-2xl font-black text-green-600 tracking-tight">SpendWise</h1>
      
      <div className="flex items-center space-x-8">
        <div className="hidden md:flex space-x-6 font-medium text-gray-600">
          <a href="#" className="hover:text-green-600 transition">Dashboard</a>
          <a href="#" className="hover:text-green-600 transition">Transactions</a>
        </div>

        <button 
          onClick={onAddClick} 
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition active:scale-95"
        >
          + Add Expense
        </button>
      </div>
    </nav>
  )
}

export default Navbar