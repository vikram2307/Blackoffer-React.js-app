import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './ChartComponent'; // Import your chart component
import LikelihoodComponent from './LikelihoodComponent';
import RelevanceComponent from './RelevanceComponent';
import CountryPieChart from './CountryPieChart';
import TopicChart from './TopicChart';
import RegionPieChart from './RegionPieChart';
import CityRadialBarChart from './Citydata';


function Content() {

  useEffect(() => {
  
  }, []);

  return (
    <div className="chart-container">
    <div className="chart">
      <ChartComponent />
   </div>
    <div className="chart">
      <LikelihoodComponent />
    </div>
    <div className="chart">
     <CityRadialBarChart/>
  </div>
    <div className="pie-container">
    <div className='pie'>
        <CountryPieChart/>
    </div>
    </div>
    <div className="Topic-container">
    <div className="Topic">
      <TopicChart/>
  </div>
  </div>
  <div className="chart-container">
    <div className="chart">
      <RegionPieChart/>
  </div>
  </div>

  <div className="">
    
  </div>
  </div>
  
  );
} 

export default Content;
