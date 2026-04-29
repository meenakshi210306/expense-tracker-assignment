import React, { useState } from 'react';
import { expenseAPI } from '../api';

const ExpenseList = ({ expenses, onExpenseDeleted, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setLoading(true);
    try {
      await expenseAPI.delete(id);
      onExpenseDeleted(id);
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert('Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!expenses || expenses.length === 0) {
    return <div className="empty-state">No expenses found. Add your first expense!</div>;
  }

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id}>
              <td>{expense.title}</td>
              <td><span className="badge">{expense.category}</span></td>
              <td className="amount">{formatAmount(expense.amount)}</td>
              <td>{formatDate(expense.date)}</td>
              <td className="description">{expense.description || '-'}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(expense.id)}
                  disabled={loading}
                  title="Delete expense"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
