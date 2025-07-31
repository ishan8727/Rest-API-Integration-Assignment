const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Weather = require('./model/weather');
const cors = require('cors');
const filterWeather = require('./helper/filterHelper');

const env = require('dotenv');
env.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (req,res)=>{
    console.log('Hitting home base URL!');

    const { location, days } = req.query;
    
    if (!location) {
        return res.status(400).json({
            success: false,
            message: 'Location is required'
        });
    }


    try {
        const weatherResponse = await axios.get('http://api.weatherapi.com/v1/forecast.json',{
            params:{
                key: process.env.API_KEY,
                q: location,
                days: days || 7
            }
        });
    
        const filteredData = filterWeather(weatherResponse.data);

        // Create a new Weather doc + save + send res
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

mongoose.connection.once('connected', () => {
    app.listen(PORT || 3333, () => {
        console.log(`Server is running on PORT: ${PORT || 3333}!`);
    });
});
