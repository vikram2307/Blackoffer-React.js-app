import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const TopicChart = () => {
  const chartRef = useRef();
  const [chart, setChart] = useState(null);
  const [topics, setTopics] = useState([]);
  const [intensities, setIntensities] = useState([]);
  const [likelihood, setLikelihood] = useState([]);
  const [relevance, setRelevance] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(''); // Add selectedCountry state
const [availableCountries, setAvailableCountries] = useState([]); // Add state for available countries

  useEffect(() => {
    fetchData();
  }, [selectedTopic, selectedCountry]);

  const fetchData = async () => {
    try {
      // Fetch topics
      const topicsResponse = await fetch(`http://localhost:8080/Topic/Country/?Country=${selectedCountry}`);
      if (!topicsResponse.ok) {
        throw new Error('Network response for topics was not ok');
      }
      const topicsData = await topicsResponse.json();
      setTopics(topicsData);

      // Fetch intensity data
      const intensitiesResponse = await fetch('http://localhost:8080/Topic/intensity');
      if (!intensitiesResponse.ok) {
        throw new Error('Network response for intensity data was not ok');
      }
      const intensitiesData = await intensitiesResponse.json();
      setIntensities(intensitiesData);

      // Fetch likelihood data
      const likelihoodResponse = await fetch('http://localhost:8080/Topic/likelihood');
      if (!likelihoodResponse.ok) {
        throw new Error('Network response for likelihood data was not ok');
      }
      const likelihoodData = await likelihoodResponse.json();
      setLikelihood(likelihoodData);

      // Fetch relevance data
      const relevanceResponse = await fetch('http://localhost:8080/Topic/relevance');
      if (!relevanceResponse.ok) {
        throw new Error('Network response for relevance data was not ok');
      }
      const relevanceData = await relevanceResponse.json();
      setRelevance(relevanceData);

      if (chart) {
        chart.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: selectedTopic ? [selectedTopic] : topicsData,
          datasets: [
            {
              label: 'Intensity',
              data: selectedTopic ? [intensitiesData[topicsData.indexOf(selectedTopic)]] : intensitiesData,
              backgroundColor: 'rgba(50, 50, 255, 0.5)',
              borderColor: 'navy',
              borderWidth: 1,
            },
            {
              label: 'Likelihood',
              data: selectedTopic ? [likelihoodData[topicsData.indexOf(selectedTopic)]] : likelihoodData,
              backgroundColor: 'rgba(255, 50, 50, 0.5)',
              borderColor: 'darkred',
              borderWidth: 1,
            },
            {
              label: 'Relevance',
              data: selectedTopic ? [relevanceData[topicsData.indexOf(selectedTopic)]] : relevanceData,
              backgroundColor: 'rgba(50, 255, 50, 0.5)',
              borderColor: 'darkgreen',
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
                text: 'Topic',
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
      <div className="Topic-container">
        <div className="centered-content">
          <div className="topic-filter">
            <label htmlFor="topicFilter">Select Topic:</label>
            <select
              id="topicFilter"
              value={selectedTopic}
              onChange={(event) => setSelectedTopic(event.target.value)}
            >
              <option value="">All</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
           
          </div>
          <h2>Topic Chart</h2>
        </div>
        <div className="Topic">
          <canvas ref={chartRef} id="topic-chart" />
        </div>
      </div>
    </div>
  );
};

export default TopicChart;
