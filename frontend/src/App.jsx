import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './App.css';

function App() {
  const gridRef = useRef();
  const [location, setLocation] = useState("New Delhi, India");
  const [days, setDays] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [colDefs, setColDefs] = useState([
    { field: "time", headerName: "Time" },
    { field: "temp_c", headerName: "Temp (°C)" },
    { field: "condition", headerName: "Condition" },
    { field: "chance_of_rain", headerName: "Chance of Rain (%)" },
    { field: "will_it_rain", headerName: "Will it Rain" }
  ]);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      floatingFilter: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    console.log("Grid is ready");
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    console.log("First data rendered");
    params.api.sizeColumnsToFit();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setRowData([]); 
      
      const response = await axios.get('http://localhost:3333/', {
        params: {
          location: location,
          days: days
        }
      });
      
      console.log("API Response:", response.data);
      
      if (response.data && response.data.data) {
        const weatherData = response.data.data;
        
        if (weatherData.forecast && weatherData.forecast.forecastday && Array.isArray(weatherData.forecast.forecastday)) {
          const forecastData = weatherData.forecast.forecastday;
          console.log("Forecast days:", forecastData.length);
          
          const hourlyData = [];
          
          forecastData.forEach(day => {
            if (day && day.hour && Array.isArray(day.hour)) {
              const dateKey = day.date || "";
              
              day.hour.forEach(hour => {
                if (hour) {
                  let timeDisplay;
                  try {
                    const timeObj = new Date(hour.time);
                    timeDisplay = timeObj.toLocaleString();
                  } catch (e) {
                    timeDisplay = hour.time || "Unknown time";
                  }
                  
                  const rowItem = {
                    time: timeDisplay,
                    temp_c: parseFloat(hour.temp_c) || 0,
                    condition: hour.condition?.text || "Unknown",
                    icon: hour.condition?.icon || "",
                    chance_of_rain: parseInt(hour.chance_of_rain) || 0,
                    will_it_rain: hour.will_it_rain === 1 || hour.will_it_rain === "1" ? 'Yes' : 'No',
                    dateKey: dateKey
                  };
                  
                  hourlyData.push(rowItem);
                }
              });
            }
          });
          
          console.log("Processed hourly data:", hourlyData);
          console.log("Number of rows:", hourlyData.length);
          
          if (hourlyData.length > 0) {
            console.log("Setting row data:", hourlyData.slice(0, 3)); 
            console.log("Total rows being set:", hourlyData.length);
            setRowData(hourlyData);
          } else {
            console.log("No hourly data processed");
            setError("No hourly weather data available for the specified location and days");
          }
        } else {
          setError("Invalid forecast data format in API response");
        }
      } else {
        console.error("Invalid API response format");
        setRowData([]);
        setError("Invalid data received from API. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(`Error: ${error.message || "Failed to fetch weather data"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("RowData changed:", {
      length: rowData.length,
      firstItem: rowData[0],
      hasData: rowData.length > 0
    });
  }, [rowData]);

  useEffect(() => {
    console.log("Component mounted, AG Grid should be available");
    
    const testData = [
      { time: "12:00", temp_c: 25, condition: "Sunny", chance_of_rain: 10, will_it_rain: "No" },
      { time: "13:00", temp_c: 27, condition: "Cloudy", chance_of_rain: 20, will_it_rain: "No" },
      { time: "14:00", temp_c: 29, condition: "Partly Cloudy", chance_of_rain: 15, will_it_rain: "No" }
    ];
    console.log("Setting initial test data:", testData);
    setRowData(testData);
  }, []);  return (
    <div className="min-h-screen bg-gray-50">
      <div className="navbar p-5 bg-black flex">
        <h1 className="text-6xl font-extrabold text-white">Weather Forecast</h1>
      </div>

      <div className="mb-6 flex items-center gap-[15px] mt-4 ml-4">
        <div className="flex flex-col">
          <label htmlFor="location-input" className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Location
          </label>
          <input
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            id="location-input"
            className="w-[300px] h-[60px] p-2 text-2xl border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="days-input" className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Days
          </label>
          <input
            placeholder="Days"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value) || 1)}
            type="number"
            min="1"
            max="10"
            id="days-input"
            className="w-[120px] h-[60px] p-2 text-2xl border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:opacity-90 disabled:opacity-50 mr-2"
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
          
          <button
            onClick={() => {
              const testData = [
                { time: "2025-07-31 12:00:00", temp_c: 25, condition: "Sunny", chance_of_rain: 10, will_it_rain: "No" },
                { time: "2025-07-31 13:00:00", temp_c: 27, condition: "Partly Cloudy", chance_of_rain: 20, will_it_rain: "No" },
                { time: "2025-07-31 14:00:00", temp_c: 29, condition: "Clear", chance_of_rain: 5, will_it_rain: "No" },
                { time: "2025-07-31 15:00:00", temp_c: 30, condition: "Hot", chance_of_rain: 0, will_it_rain: "No" }
              ];
              console.log("Setting test data:", testData);
              setRowData(testData);
              setError(null);
            }}
            className="px-5 py-2.5 text-white font-semibold bg-gradient-to-r from-green-600 to-teal-500 rounded-lg hover:opacity-90"
          >
            Test Grid
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-indicator m-4 flex justify-center items-center">
          <div className="text-xl">Loading weather data...</div>
        </div>
      ) : (
        <div className="m-4">
          {rowData.length === 0 && !error && !loading && (
            <div className="p-4 bg-blue-100 text-blue-800 rounded mb-4">
              No data to display. Grid will load with test data automatically.
            </div>
          )}
          
          <div 
            className="ag-theme-quartz" 
            style={{ 
              height: '500px', 
              width: '100%'
            }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50]}
              onGridReady={onGridReady}
              onFirstDataRendered={onFirstDataRendered}
            />
          </div>
        </div>
      )}

      <div className="footer p-5 w-full h-[100px] bg-black mt-8"></div>
    </div>
  );
}

export default App;