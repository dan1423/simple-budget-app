// EditBudgetForm.js
import React, { useState } from 'react';

const EditBudget = ({ budget, onSave }) => {
  const [budgetType, setBudgetType] = useState(budget.budgetType);
  const [budgetAmount, setBudgetAmount] = useState(budget.budgetAmount);
  const [budgetDate, setBudgetDate] = useState(budget.budgetDate);
  const [note, setNote] = useState(budget.budgetNotes);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: budget.id,
      type: budgetType,
      amount: budgetAmount,
      date: budgetDate,
      note: note
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={budgetType} onChange={(e) => setBudgetType(e.target.value)} placeholder="Budget Type" />
      <input type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} placeholder="Budget Amount" />
      <input type="date" value={budgetDate} onChange={(e) => setBudgetDate(e.target.value)} />
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note"></textarea>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditBudget;
