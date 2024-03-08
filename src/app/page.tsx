"use client";
import React, { useEffect, useState } from 'react';
import Budgets from './components/Budgets';

export default function Home() {
  const [budgetData, setBudgetData] = useState([]);
  return (
    <main className="flex min-h-screen flex-col  justify-between pt-5 bg-white">
      <div className="row container">
          <Budgets />
      </div>

    </main>
  );
}
