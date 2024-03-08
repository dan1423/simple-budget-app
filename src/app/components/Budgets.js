import React, { useEffect, useState } from 'react';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';

const Budgets = (props) => {
  const [budgets, setBudgets] = useState([]);
  //const [UneditedBudgets, setUneditedBudgets] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [budgetTypes, setBudgetTypes] = useState([]);
  const [pieChart, setPieChart] = useState([]);
  const[maxBudget,setMaxBudget]=useState(0);  
  const[barChartDataSet,setBarChartDataSet]=useState([]);
  // const[maxBudgetPerType,setMaxBudgetPerTypeType]=useState('');
  const BASE_URL = 'https://dan1423-001-site1.btempurl.com/budget/budgetsamples';
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
    try {
      const response = await fetch('https://dan1423-001-site1.btempurl.com/budget/budgettypes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      throw error; // Re-throw the error for further handling if necessary
    }
  };

  useEffect(() => {
    fetch('https://dan1423-001-site1.btempurl.com/budget/budgetsamples')
      .then(response => response.json())
      .then(data => {
        setBudgets(data);
        setMaxBudget(4000);
       
        if (!isLoaded) {
          //setUneditedBudgets(data);
          setIsLoaded(true);
        }
      })
      .catch(error => {
        console.error('Error fetching budget list:', error);
      });
  }, []);

  useEffect(() => {
    fetchBudgetTypes().then(setBudgetTypes);
  }, []);


  const PreparePieChartData = () => {
    let sumsArray = [];
    let currentIndex = -1;
    budgets.forEach(element => {
      console.log("element",element); 
      let data = sumsArray.find(function (ele, index) {
        currentIndex = index;
        return ele.name === element.budgetTypeCategory;
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
      <h1>Budget Dashboard v1</h1>
      <div><strong className="mr-2">Maximum Budget:</strong>{maxBudget}</div>
      <div>
        <span className="mr-2"><strong>Budget Percentages</strong></span>
        {Object.entries(budgetPercentages).map(([category, percentage], index) => (
        <span key={index} className="mr-2">{`${category}: ${percentage}%`}</span>
      ))}
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
          <PieChart data={pieChart} />
          <BarChart data={barChartDataSet} />
        </div>
      </div>
    
    </div>
  );
};

export default Budgets;