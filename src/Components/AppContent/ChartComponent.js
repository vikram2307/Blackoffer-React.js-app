import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const EndYearChart = () => {
  const chartRef = useRef();
  const [chart, setChart] = useState(null);
  const [endYears, setEndYears] = useState([]);
  const [endYearIntensities, setEndYearIntensities] = useState([]);
  const [selectedEndYear, setSelectedEndYear] = useState('');
  const [likelihoodData, setLikelihoodData] = useState([]);
  const [relevanceData, setRelevanceData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedEndYear]);

  const fetchData = async () => {
    try {
      // Fetch end year data
      const endYearsResponse = await fetch('http://localhost:8080/endyears');
      if (!endYearsResponse.ok) {
        throw new Error('Network response for end years was not ok');
      }
      const endYearsData = await endYearsResponse.json();
      setEndYears(endYearsData);

      // Fetch end year intensities
      const endYearIntensitiesResponse = await fetch('http://localhost:8080/intensity/all/endyear');
      if (!endYearIntensitiesResponse.ok) {
        throw new Error('Network response for end year intensities was not ok');
      }
      const endYearIntensitiesData = await endYearIntensitiesResponse.json();
      setEndYearIntensities(endYearIntensitiesData);

      // Fetch likelihood and relevance data
      const likelihoodResponse = await fetch('http://localhost:8080/likelihoodbyendyear');
      if (!likelihoodResponse.ok) {
        throw new Error('Network response for likelihood data was not ok');
      }
      const likelihoodData = await likelihoodResponse.json();
      setLikelihoodData(likelihoodData);

      const relevanceResponse = await fetch('http://localhost:8080/Relevancebyendyear');
      if (!relevanceResponse.ok) {
        throw new Error('Network response for relevance data was not ok');
      }
      const relevanceData = await relevanceResponse.json();
      setRelevanceData(relevanceData);

      if (chart) {
        chart.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      let dataToDisplay = endYearIntensitiesData; // Use all intensities by default

      if (selectedEndYear) {
        // Filter intensities based on the selected end year
        dataToDisplay = endYearIntensitiesData.filter((intensity, index) => endYearsData[index] === selectedEndYear);
      }

      const newChart = new Chart(ctx, {
        type: 'bubble',
        data: {
          labels: selectedEndYear ? [selectedEndYear] : endYearsData,
          datasets: [
            {
              label: 'End Year Intensity',
              data: dataToDisplay,
              backgroundColor: 'rgba(50, 50, 255, 0.5)', // Dark blue
              borderColor: 'navy', // Dark blue
              borderWidth: 1,
            },
            {
              label: 'Likelihood',
              data: likelihoodData,
              backgroundColor: 'rgba(255, 50, 50, 0.5)', // Dark red
              borderColor: 'darkred', // Dark red
              borderWidth: 1,
            },
            {
              label: 'Relevance',
              data: relevanceData,
              backgroundColor: 'rgba(50, 255, 50, 0.5)', // Dark green
              borderColor: 'darkgreen', // Dark green
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
                text: 'Intensity/Likelihood/Relevance',
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
      <h2>End Year Intensity, Likelihood, and Relevance Chart</h2>
      <div className="end-year-container">
        <div className="chart">
          <canvas ref={chartRef} id="end-year-chart" />
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
    </div>
  );
};

export default EndYearChart;
