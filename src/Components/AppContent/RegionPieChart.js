import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const RegionPieChart = () => {
  const chartRef = useRef();
  const [chart, setChart] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [intensityData, setIntensityData] = useState([]);
  const [relevanceData, setRelevanceData] = useState([]);
  const [likelihoodData, setLikelihoodData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('Intensity'); // Default to 'Intensity'

  useEffect(() => {
    fetchData();
  }, [selectedCountry, selectedDataType]);

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
      const countryResponse = await fetch('http://localhost:8080/Region');
      const intensityResponse = await fetch('http://localhost:8080/Region/intensity');
      const relevanceResponse = await fetch('http://localhost:8080/Region/relevance');
      const likelihoodResponse = await fetch('http://localhost:8080/Region/likelihood');

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

      switch (selectedDataType) {
        case 'Intensity':
          dataToDisplay = intensityData;
          break;
        case 'Relevance':
          dataToDisplay = relevanceData;
          break;
        case 'Likelihood':
          dataToDisplay = likelihoodData;
          break;
        default:
          dataToDisplay = intensityData;
      }

      if (selectedCountry) {
        // Filter data based on the selected country
        dataToDisplay = dataToDisplay.filter((_, index) => countryData[index] === selectedCountry);
      }

      const newChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: selectedCountry ? [selectedCountry] : countryData,
          datasets: [
            {
              label: selectedDataType,
              data: dataToDisplay,
              backgroundColor: backgroundColors,
            },
          ],
        },
        options: {
          cutout: '70%',
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
      <div className="Topic-container">
        <div className="centered-content">
          <div className="topic-filter">
            <h3>Region Chart</h3>
            <label htmlFor="countryFilter">Select Region:</label>
            <select
              id="countryFilter"
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
          <canvas ref={chartRef} id="countryPieChart" />
        </div>
      </div>
    </div>
  );
};

export default RegionPieChart;
