import React, { useEffect, useState } from 'react';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import BudgetTypeData from '../data/BudgetTypeData';
import BudgetData from '../data/BudgetData';
const Budgets = (props) => {
  const [budgets, setBudgets] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [budgetTypes, setBudgetTypes] = useState([]);
  const [pieChart, setPieChart] = useState([]);
  const[maxBudget,setMaxBudget]=useState(0);  
  const[barChartDataSet,setBarChartDataSet]=useState([]);

 
  const budgetPercentages = {
    Housing: 30,
    Utilities: 10,
    Food: 15,
    Transportation: 10,
    Health: 10,
    PersonalCare: 5,
    Miscellaneous: 10,
  };

  const barChartData = [
    {
      x: "Housing",
      Current: 1200,
      Threshold: 1200,
    },
    {
      x: "Utilities",
      Current: 300,
      Threshold: 400,
    },
    {
      x: "Food",
      Current: 200,
      Threshold: 600,
    },
    {
      x: "Health",
      Current: 150,
      Threshold: 400,
    },
    {
      x: "PersonalCare",
      Current: 250,
      Threshold: 200,
    },
    {
      x: "Miscellaneous",
      Current: 350,
      Threshold: 400,
    }
    ]
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
  };

  const fetchBudgetTypes = async () => {
    return BudgetTypeData;

  
  };

  useEffect(() => {
    setBudgets(BudgetData);
    setMaxBudget(4000);
  }, []);

  useEffect(() => {
    fetchBudgetTypes().then(setBudgetTypes);
  }, []);


  const PreparePieChartData = () => {
    let sumsArray = [];
    let currentIndex = -1;
    
    budgets.forEach(element => {
      
      let data = sumsArray.find(function (ele, index) {
        currentIndex = index;
        return ele.name === element.budgetType;
      });
   
      if (data === undefined) {
        let pieChartData = {
        "name":element.budgetTypeCategory, 
        "value": parseInt(element.budgetAmount)
      };
        sumsArray.push(pieChartData);
        
      }

     else {
      
        sumsArray[currentIndex].value += parseInt(element.budgetAmount);    
      }
    });
    setPieChart(sumsArray);
   
  }
  useEffect(() => {
    if (budgets.length > 0) {
      PreparePieChartData(); // Prepare data when budgets update
      setBarChartDataSet(barChartData);
    }
  }, [budgets]); 

  const handleBudgetChange = (budgetId, field, value) => {
    setBudgets(budgets =>
      budgets.map(budget =>
        budget.budgetId === budgetId ? { ...budget, [field]: value } : budget
      )
    );
  };


  const handleMaxBudgetChange = (value) => {
    setBudgets(budgets =>
      budgets.map(budget =>
        budget.budgetId === budgetId ? { ...budget, [field]: value } : budget
      )
    );


  
  };
    // Grouping budget types by category
    const groupedBudgetTypes = budgetTypes.reduce((acc, { budgetTypeId, budgetTypeName, budgetTypeCategory }) => {
      if (!acc[budgetTypeCategory]) {
        acc[budgetTypeCategory] = [];
      }
      acc[budgetTypeCategory].push({ budgetTypeId, budgetTypeName });
      return acc;
    }, {});
  

  // const SaveBudget = (budgetId) => {
  //   const editedBudget = budgets.find(budget => budget.budgetId === budgetId);
  //   const unEditedBudget = UneditedBudgets.find(budget => budget.budgetId === budgetId);
  //   const isSame = compareBudget(editedBudget, unEditedBudget);
  //   if (!isSame) {
  //     updateBudget(editedBudget);
  //   }
  //   else {

  //   }
  // }
  // const compareBudget = (editedBudget, unEditedBudget) => {
  //   return JSON.stringify(editedBudget) === JSON.stringify(unEditedBudget);
  // };

  // const updateBudget = async (budget) => {
  //   const url = `https://localhost:7166/budget/${budget.budgetId}`; // Endpoint for updating budget with ID 1
  //   const data = {
  //     budgetId: budget.budgetId,
  //     budgetType: budget.budgetType,
  //     budgetAmount: budget.budgetAmount,
  //     budgetDate: budget.budgetDate,
  //     budgetNotes: budget.budgetNotes,
  //   };

  //   try {
  //     const response = await fetch(url, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status}`);
  //     }

  //     const updatedBudget = await response.json();
  //   } catch (error) {
  //     console.error('Failed to update budget:', error);
  //   }
  // };



  return (
    <div>
      <div className="justify-center items-center"><p className="text-4xl mb-2 content-center">Budget Dashboard v1</p></div>
      
      <div className="text-2xl mb-2"><label>Edit Current Budget:</label> <input 
                    type="number"
                    defaultValue={maxBudget}
                    onChange={(e) => handleMaxBudgetChange(e.target.value)}>
                  </input></div>
      <div>
        <span className="mr-2"><strong>Budget Percentages:</strong></span>
        <ul>{Object.entries(budgetPercentages).map(([category, percentage], index) => (
        <li key={index} className="mr-2">{`${category}: ${percentage}%`}</li>
      ))}</ul>
        
      </div>
      <div className="grid grid-flow-col gap-3">
        <div className="col-span-4">
        <table className="table">
        <thead>
          <tr>
            <th className="fixed-width-100">Type</th>
            <th>Amount</th>
            <th className="fixed-width-100"> Date</th>
            <th className="fixed-width-100">Note</th>
            <th></th>

          </tr>
        </thead>
        <tbody>


          {budgets == null ? (
            <tr></tr>
          ) :
            budgets.map(budget => (
              <tr key={budget.budgetId}>
                <td>
                  <select
                  disabled
                    value={budget.budgetType}
                    onChange={(e) => handleBudgetChange(budget.budgetId, 'budgetType', e.target.value)}
                  >
                    {Object.entries(groupedBudgetTypes).map(([category, types]) => (
                      <optgroup label={category} key={category}>
                        {types.map(type => (
                          <option value={type.budgetTypeName} key={type.budgetTypeId}>{type.budgetTypeName}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </td>
                <td>
                  <input key={budget.budgetId} type="number"
                    defaultValue={budget.budgetAmount}
                    onChange={(e) => handleBudgetChange(budget.budgetId, 'budgetAmount', e.target.value)}>
                  </input>
                </td>
                <td>
                  <input key={budget.budgetId}
                    type="date"
                    defaultValue={formatDate(budget.budgetDate)}
                    onChange={(e) => handleBudgetChange(budget.budgetId, 'budgetDate', e.target.value)}>
                  </input>
                </td>
                <td>
                  <input key={budget.budgetId}
                    type="text"
                    defaultValue={budget.budgetNotes}
                    onChange={(e) => handleBudgetChange(budget.budgetId, 'budgetNotes', e.target.value)}>
                  </input>
                </td>
                {/* <td><button key={budget.budgetId} className='btn btn-primary' onClick={() => SaveBudget(budget.budgetId)}>Save</button></td> */}
              </tr>
            ))
          }
        </tbody>
      </table>
        </div>
        <div className="col-span-1"> 

          <div>
          <p className="text-3xl mb-2"><strong>Pie Chart for Budget Categories</strong></p>
          <PieChart data={pieChart} />
          </div>
          

          <p className="text-3xl mb-2"><strong>Bar Chart for Amount Spent versus Threshold</strong></p>
          <i className="p-3">***Amount spent is in red, The maximum allowed for the budget type is is in gold.
          The closer the amount spent is to the maximum the more the bar will be filled.
           The chart is default I will update to make dynamic***</i>
          <BarChart data={barChartDataSet} />
        </div>
      </div>
    
    </div>
  );
};

export default Budgets;