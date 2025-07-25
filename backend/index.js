const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Weather = require('./model/weather');

const env = require('dotenv');
env.config();
const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/weatherdb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
app.use(express.json());

app.get('/', async (req,res)=>{
    console.log('Hitting home base URL!');

    const { location, days } = req.body;
    
    if (!location) {
        return res.status(400).json({
            success: false,
            message: 'Location is required'
        });
    }

    const filterWeather=(weatherForecast)=>{
        const filteredData = {
            location: {
                name: weatherForecast.location.name,
                region: weatherForecast.location.region,
                country: weatherForecast.location.country,
                lat: weatherForecast.location.lat,
                lon: weatherForecast.location.lon
            },
            current: {
                temp_c: weatherForecast.current.temp_c,
                condition: weatherForecast.current.condition.text,
                humidity: weatherForecast.current.humidity,
                wind_kph: weatherForecast.current.wind_kph,
                feelslike_c: weatherForecast.current.feelslike_c,
                uv: weatherForecast.current.uv
            },
            forecast: weatherForecast.forecast.forecastday.map(day => ({
                date: day.date,
                maxtemp_c: day.day.maxtemp_c,
                mintemp_c: day.day.mintemp_c,
                avgtemp_c: day.day.avgtemp_c,
                condition: day.day.condition.text,
                chance_of_rain: day.day.daily_chance_of_rain,
                maxwind_kph: day.day.maxwind_kph
            }))
        };
        
        return filteredData;
    }

    try {
        const weatherResponse = await axios.get('http://api.weatherapi.com/v1/forecast.json?',{
            params:{
                Key: process.env.API_KEY,
                q: location,
                days: days
            }
        });
    
        const filteredData = filterWeather(weatherResponse.data);

        // Create a new Weather document + save to db + send res
        const weatherData = new Weather(filteredData);
        const savedWeather = await weatherData.save();

        res.status(200).json({
            success: true,
            message: 'Weather data saved successfully',
            data: savedWeather
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing weather data',
            error: error.message
        });
    }
})


app.listen(PORT || 3333, ()=>{
    console.log(`Server is running on PORT: ${PORT}!`);
})
