import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterBar from './components/FilterBar';
import CategorySummary from './components/CategorySummary';
import { expenseAPI } from './api';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await expenseAPI.getAll();
      const sorted = [...response.data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sorted);
      setFilteredExpenses(sorted);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    const updated = [newExpense, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    setExpenses(updated);
    setFilteredExpenses(updated);
    setShowForm(false);
  };

  const handleExpenseDeleted = (id) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    setFilteredExpenses(updatedExpenses.filter(exp => exp.id !== id));
  };

  const handleFilterApply = (filteredData) => {
    setFilteredExpenses(filteredData);
  };

  const handleClearFilter = () => {
    setFilteredExpenses(expenses);
  };

  const calculateTotal = (expenseList) => {
    return expenseList.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  };

  const totalAmount = calculateTotal(filteredExpenses);

  if (loading) {
    return <div className="app loading">Loading expenses...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Expense Tracker</h1>
        <button
          className="add-expense-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close' : '+ Add Expense'}
        </button>
      </header>

      <main className="main-content">
        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <ExpenseForm
            onExpenseAdded={handleExpenseAdded}
            onCancel={() => setShowForm(false)}
          />
        )}

        <FilterBar
          onFilterApply={handleFilterApply}
          onClear={handleClearFilter}
        />

        <div className="total-section">
          <h3>Total: ${totalAmount.toFixed(2)}</h3>
        </div>

        <CategorySummary expenses={filteredExpenses} />

        <ExpenseList
          expenses={filteredExpenses}
          onExpenseDeleted={handleExpenseDeleted}
          onRefresh={fetchExpenses}
        />
      </main>
    </div>
  );
}

export default App;
