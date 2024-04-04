import { useEffect, useRef } from 'react';
import {Bar} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

const BarChart = ({ budgetData,maxBudget }) => {
  const labels = budgetData.map(item => item.x);
  const current = budgetData.map(item => item.Current);
  const threshold = budgetData.map(item => item.Threshold);

  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

   const options = {
    plugins: {
      title: {
        display: true,
        text: 'Budget THresholds vs Current Spending',
      },
    },
   
   
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

   const data = {
    labels,
    datasets: [
      {
        label: 'Current Spending',
        data: current,
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Threshold',
        data: threshold,
        backgroundColor: 'rgb(75, 192, 192)',
      }
    ],
  };

  return(
    <div style={{width: '500px',height:'600px'}}>
        <Bar options={options} data={data} />
    </div>
   
  );
}

export default BarChart;
