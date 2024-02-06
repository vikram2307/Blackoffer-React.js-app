import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const CountryPieChart = () => {
  const chartRef = useRef();
  const [chart, setChart] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [intensityData, setIntensityData] = useState([]);
  const [relevanceData, setRelevanceData] = useState([]);
  const [likelihoodData, setLikelihoodData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('Intensity');

  useEffect(() => {
    fetchData();
  }, [selectedCountry, selectedDataType]);

  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      // Generate a random RGB color
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;
      colors.push(color);
    }
    return colors;
  };

  const fetchData = async () => {
    try {
      const countryResponse = await fetch('http://localhost:8080/Country');
      const intensityResponse = await fetch('http://localhost:8080/Country/intensity');
      const relevanceResponse = await fetch('http://localhost:8080/Country/relevance');
      const likelihoodResponse = await fetch('http://localhost:8080/Country/likelihood');

      if (!countryResponse.ok || !intensityResponse.ok || !relevanceResponse.ok || !likelihoodResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const countryData = await countryResponse.json();
      const intensityData = await intensityResponse.json();
      const relevanceData = await relevanceResponse.json();
      const likelihoodData = await likelihoodResponse.json();

      setCountryData(countryData);
      setIntensityData(intensityData);
      setRelevanceData(relevanceData);
      setLikelihoodData(likelihoodData);

      if (chart) {
        chart.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const backgroundColors = generateRandomColors(countryData.length);

      let dataToDisplay = [];
      if (selectedDataType === 'Intensity') {
        dataToDisplay = intensityData;
      } else if (selectedDataType === 'Relevance') {
        dataToDisplay = relevanceData;
      } else if (selectedDataType === 'Likelihood') {
        dataToDisplay = likelihoodData;
      }

      if (selectedCountry) {
        dataToDisplay = dataToDisplay.filter((_, index) => countryData[index] === selectedCountry);
      }

      const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: selectedCountry ? [selectedCountry] : countryData,
          datasets: [
            {
              data: dataToDisplay,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          legend: {
            display: true,
            position: 'right',
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
      <div className="pie-container">
       
        <label htmlFor="countryFilter">Select Country:</label>
        <select
          id="filter"
          value={selectedCountry}
          onChange={(event) => setSelectedCountry(event.target.value)}
        >
          <option value="">All</option>
          {countryData.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <label htmlFor="dataTypeFilter">Select Data Type:</label>
        <select
          id="dataTypeFilter"
          value={selectedDataType}
          onChange={(event) => setSelectedDataType(event.target.value)}
        >
          <option value="Intensity">Intensity</option>
          <option value="Relevance">Relevance</option>
          <option value="Likelihood">Likelihood</option>
        </select>
        <div className="vertical-text">
            <h2>Country Pie Chart</h2>
         </div>   
        <div className="pie">
          <canvas ref={chartRef} id="countryPieChart" />
        </div>
      </div>
    </div>
  );
};

export default CountryPieChart;
