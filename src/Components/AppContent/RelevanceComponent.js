import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const RelevanceChart = () => {
  const chartRef = useRef();
  const [chart, setChart] = useState(null);
  const [endYears, setEndYears] = useState([]);
  const [relevanceData, setRelevanceData] = useState([]);
  const [selectedEndYear, setSelectedEndYear] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedEndYear]);

  const fetchData = async () => {
    try {
      const endYearsResponse = await fetch('http://localhost:8080/endyears');
      const relevanceResponse = await fetch('http://localhost:8080/Relevancebyendyear');

      if (!endYearsResponse.ok || !relevanceResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const endYearsData = await endYearsResponse.json();
      const relevanceData = await relevanceResponse.json();

      setEndYears(endYearsData);
      setRelevanceData(relevanceData);

      if (chart) {
        chart.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      let dataToDisplay = relevanceData; // Use all data by default

      if (selectedEndYear) {
        // Filter data based on the selected end year
        dataToDisplay = relevanceData.filter((relevance, index) => endYearsData[index] === selectedEndYear);
      }

      const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: selectedEndYear ? [selectedEndYear] : endYearsData,
          datasets: [
            {
              label: 'Relevance',
              data: dataToDisplay,
              backgroundColor: 'rgba(255, 255, 0, 0.2)', // Yellow background with 20% opacity
              borderColor: 'blue',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'End Years',
              },
            },
            y: {
              type: 'linear',
              title: {
                display: true,
                text: 'Relevance',
              },
            },
          },
        },
      });

      setChart(newChart);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="chart-container">
      <h2>Relevance Chart</h2>
      <div className="chart">
        <canvas ref={chartRef} id="relevance-chart" />
      </div>
      <div className="end-year-filter">
        <label htmlFor="endYearFilter">Select End Year:</label>
        <select
          id="endYearFilter"
          value={selectedEndYear}
          onChange={(event) => setSelectedEndYear(event.target.value)}
        >
          <option value="">All</option>
          {endYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RelevanceChart;
