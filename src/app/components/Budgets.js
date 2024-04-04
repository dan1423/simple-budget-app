import React, { useEffect, useState } from 'react';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import BudgetTypeData from '../data/BudgetTypeData';
import BudgetData from '../data/BudgetData';
import StackedBarPlot from '../charts/StackedBarPlot';
const Budgets = (props) => {
  const [budgets, setBudgets] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [budgetTypes, setBudgetTypes] = useState([]);
  const [pieChart, setPieChart] = useState([]);
  const [maxBudget, setMaxBudget] = useState(0);
  const [budgetPercentages, setBudgetPercentages] = useState({
    Housing: 40,
    Utilities: 10,
    Food: 15,
    Transportation: 10,
    Health: 10,
    PersonalCare: 5,
    Miscellaneous: 10,
  });
  const [barChartDataSet, setBarChartDataSet] = useState([]);

var counter = 0;
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
    var totalSum = 0;
    budgets.forEach(element => {
     
      let data = sumsArray.find(function (ele, index) {
        currentIndex = index;
        
        return ele.name === element.budgetTypeCategory;
      });
     
      if (data === undefined) {
        let currentPiechartData = {
          "name": element.budgetTypeCategory,
          "value": parseInt(element.budgetAmount)
        };
       
        sumsArray.push(currentPiechartData);
      }

      else {
        sumsArray[currentIndex].value += parseInt(element.budgetAmount);
      }
      totalSum += parseInt(element.budgetAmount);
    });
    let remaining = maxBudget - totalSum;
    let currentPiechartData = {
      "name": "Remaining",
      "value": remaining
    };
    sumsArray.push(currentPiechartData);
    setPieChart(sumsArray);
  }

  const prepareBarChartData = () => {
  
    let curBarChartDataSet = [{
      x: "Housing",
      Current: 0,
      Threshold: 0,
    },
    {
      x: "Utilities",
      Current: 0,
      Threshold: 0,
    },
    {
      x: "Food",
      Current: 0,
      Threshold: 0,
    },
    {
      x: "Health",
      Current: 0,
      Threshold: 0,
    },
    {
      x: "PersonalCare",
      Current: 0,
      Threshold: 0,
    },
    {
      x: "Miscellaneous",
      Current: 0,
      Threshold: 0,
    }];
    budgets.forEach(element => {
      curBarChartDataSet = updateCurrentAmounts(curBarChartDataSet,element.budgetTypeCategory, element.budgetAmount, maxBudget);
    });
    budgetTypes.forEach(element => {
      curBarChartDataSet = updateCurrentThresholds(curBarChartDataSet,element.budgetTypeCategory, maxBudget);
    });
   
    setBarChartDataSet(curBarChartDataSet);
  };

  useEffect(() => {
    if (budgets.length > 0) {
      PreparePieChartData(); // Prepare data when budgets update
      console.log(barChartDataSet);
      prepareBarChartData();
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
    setMaxBudget(value);
  };

  const handlePercentageChange = (category, value, target) => {
    let total = 0;
    let current = 0;
    for (const [key, value] of Object.entries(budgetPercentages)) {
      if (key === category) {
        current = value;
      }
      total += value;
    }
    total = total - current + parseInt(value);
    if (total > 100) {
      target.value = current;
      alert("Total percentage cannot exceed 100%");
      return;
    }
    else {
      setBudgetPercentages(prevState => ({
        ...prevState,
        [category]: parseInt(value)
      }));
    }
  };

  function updateCurrentAmounts(barChartDataSet,category, newValue,maxBudget) {
    category = category.replace(/\s/g, '');
    const index = barChartDataSet.findIndex(item => item.x === category);
    // If the category is found, update its current value
    if (index !== -1) {
      const updatedItem = { ...barChartDataSet[index] };
      updatedItem.Current += parseInt(newValue);
     
      barChartDataSet[index] = updatedItem;
    } 
    return barChartDataSet;
  }

  function updateCurrentThresholds(barChartDataSet,category,maxBudget) {
    category = category.replace(/\s/g, '');
    // Find the index of the category in the barChartData array
    const index = barChartDataSet.findIndex(item => item.x === category);
    // If the category is found, update its current value
    if (index !== -1) {
      const updatedItem = { ...barChartDataSet[index] };
  
     updatedItem.Threshold =(budgetPercentages[category]/100) * maxBudget;
      barChartDataSet[index] = updatedItem;
    } 
    return barChartDataSet;
  }
  
 

  // Grouping budget types by category
  const groupedBudgetTypes = budgetTypes.reduce((acc, { budgetTypeId, budgetTypeName, budgetTypeCategory }) => {
    if (!acc[budgetTypeCategory]) {
      acc[budgetTypeCategory] = [];
    }
    acc[budgetTypeCategory].push({ budgetTypeId, budgetTypeName });
    return acc;
  }, {});




  return (
    <div>
      <div className="justify-center items-center"><p className="text-4xl mb-2 content-center">Budget Dashboard v1</p></div>

      <div className="text-2xl mb-2"><label>Current Budget:</label> <input
        type="number"
        defaultValue={maxBudget}
        disabled
        >
          {/* onChange={(e) => handleMaxBudgetChange(e.target.value)} */}
      </input></div>
    
      <div className="grid grid-flow-col gap-3">
        <div className="col-span-4">
          <table className="table">
            <thead>
              <tr>
                <th className="w-32">Type</th>
                <th>Amount</th>
                <th className="w-32"> Date</th>
                <th className="w-32">Budget Type</th>
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
                      className="w-32"
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
                        defaultValue={budget.budgetTypeCategory}
                       disabled>
                      </input>
                    </td> 
                    {/* <td><button key={budget.budgetId} className='btn btn-primary' onClick={() => SaveBudget(budget.budgetId)}>Save</button></td> */}
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div>
            <p><i>***User can change amount to change in pie chart and stacked bar chart***</i></p>
          </div>
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
          <BarChart budgetData={barChartDataSet} maximumBudget={maxBudget}/>
          {/* <StackedBarPlot data={barChartDataSet} /> */}
        </div>
      </div>

    </div>
  );
};

export default Budgets;