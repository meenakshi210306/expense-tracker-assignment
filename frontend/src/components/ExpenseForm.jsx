import React, { useState } from 'react';
import { expenseAPI } from '../api';

const ExpenseForm = ({ onExpenseAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent duplicate submits
    setError('');

    // Basic validation
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Amount must be a number greater than 0');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.date) {
      setError('Date is required');
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        ...formData,
        amount: amountNum,
        date: new Date(formData.date).toISOString(),
      };

      const response = await expenseAPI.create(expenseData);
      onExpenseAdded(response.data);

      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onCancel}>
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="expense-form">
          <h2>Add New Expense</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter expense title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description (optional)"
            rows="3"
          />
        </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Submit Expense'}
              </button>
              <button type="button" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
