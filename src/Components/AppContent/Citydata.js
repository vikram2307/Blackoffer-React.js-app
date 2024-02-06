import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const CityPieChart = () => {
  const chartRef = useRef();
  const [chart, setChart] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [intensityData, setIntensityData] = useState([]);
  const [relevanceData, setRelevanceData] = useState([]);
  const [likelihoodData, setLikelihoodData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('Intensity'); // Default to 'Intensity'

  useEffect(() => {
    fetchData();
  }, [selectedCity, selectedDataType]);

  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      // Generate a random HSL color
      const hue = (i * 30) % 360; // Adjust the step and range as needed
      const color = `hsla(${hue}, 70%, 60%, 0.7)`;
      colors.push(color);
    }
    return colors;
  };

  const fetchData = async () => {
    try {
      const cityResponse = await fetch('http://localhost:8080/City'); // Update URL for City data
      const intensityResponse = await fetch('http://localhost:8080/City/intensity'); // Update URL for City intensity data
      const relevanceResponse = await fetch('http://localhost:8080/City/relevance'); // Fetch relevance data
      const likelihoodResponse = await fetch('http://localhost:8080/City/likelihood'); // Fetch likelihood data

      if (!cityResponse.ok || !intensityResponse.ok || !relevanceResponse.ok || !likelihoodResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const cityData = await cityResponse.json();
      const intensityData = await intensityResponse.json();
      const relevanceData = await relevanceResponse.json(); // Get relevance data
      const likelihoodData = await likelihoodResponse.json(); // Get likelihood data

      setCityData(cityData);
      setIntensityData(intensityData);
      setRelevanceData(relevanceData);
      setLikelihoodData(likelihoodData);

      if (chart) {
        chart.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      const backgroundColors = generateRandomColors(cityData.length);

      let dataToDisplay = [];
      if (selectedDataType === 'Intensity') {
        dataToDisplay = intensityData;
      } else if (selectedDataType === 'Relevance') {
        dataToDisplay = relevanceData;
      } else if (selectedDataType === 'Likelihood') {
        dataToDisplay = likelihoodData;
      }

      if (selectedCity) {
        // Filter data based on the selected city
        dataToDisplay = dataToDisplay.filter((_, index) => cityData[index] === selectedCity);
      }

      const newChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: selectedCity ? [selectedCity] : cityData,
          datasets: [
            {
              label: selectedDataType,
              data: dataToDisplay,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          cutout: '70%', // Create a doughnut hole for a unique design
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
      <div className="City-container">
        <div className="centered-content">
          <div className="city-filter">
            <h3>City Chart</h3>
            <label htmlFor="cityFilter">Select City:</label>
            <select
              id="cityFilter"
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
            >
              <option value="">All</option>
              {cityData.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Dropdown to select data type (intensity, relevance, or likelihood) */}
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
          </div>
          <canvas ref={chartRef} id="cityPieChart" />
        </div>
      </div>
    </div>
  );
};

export default CityPieChart;
