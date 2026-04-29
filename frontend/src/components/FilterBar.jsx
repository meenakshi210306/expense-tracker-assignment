import React, { useState } from 'react';
import { expenseAPI } from '../api';

const FilterBar = ({ onFilterApply, onClear }) => {
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      // Start with all expenses
      const allResponse = await expenseAPI.getAll();
      let results = allResponse.data;

      // Apply category filter if selected
      if (filters.category) {
        results = results.filter(exp => exp.category === filters.category);
      }

      // Apply date range filters
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0); // Start of day
        results = results.filter(exp => new Date(exp.date) >= startDate);
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        results = results.filter(exp => new Date(exp.date) <= endDate);
      }

      // Sort results by date descending (newest first)
      results.sort((a, b) => new Date(b.date) - new Date(a.date));

      onFilterApply(results);
    } catch (err) {
      console.error('Failed to apply filters:', err);
      alert('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
    });
    onClear();
  };

  return (
    <div className="filter-bar">
      <h3>Filter Expenses</h3>
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="filter-actions">
          <button
            onClick={handleFilter}
            disabled={loading}
            className="filter-btn"
          >
            {loading ? 'Filtering...' : 'Apply Filter'}
          </button>
          <button
            onClick={handleClear}
            className="clear-btn"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
