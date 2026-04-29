import React from 'react';

const CategorySummary = ({ expenses }) => {
  // Calculate total per category
  const categorySummary = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + (expense.amount || 0);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categorySummary)
    .sort((a, b) => b[1] - a[1]); // sort by amount descending

  if (sortedCategories.length === 0) {
    return (
      <div className="category-summary">
        <h3>Spending by Category</h3>
        <p className="no-data">No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="category-summary">
      <h3>Spending by Category</h3>
      <div className="summary-list">
        {sortedCategories.map(([category, total]) => (
          <div key={category} className="summary-item">
            <span className="category-name">{category}</span>
            <span className="category-amount">${total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySummary;
