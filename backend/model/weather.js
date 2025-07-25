const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: {
    name: { type: String, trim: true, required: true },
    region: { type: String, trim: true, required: true },
    country: { type: String, trim: true, required: true }
  },
  current: {
    temp_c: { type: Number, required: true },
    condition: { 
      text: { type: String, trim: true },
      icon: { type: String, trim: true }, // URL to the weather icon
    },
    humidity: { type: Number }
  },
  forecast: {
    forecastday: [{ // Array to hold daily forecasts
      date: { type: Date, required: true }, // Date of the forecast day
      date_epoch: { type: Number }, // Unix timestamp
      day: {
        maxtemp_c: { type: Number, required: true },
        mintemp_c: { type: Number, required: true },
        avgtemp_c: { type: Number },
        daily_will_it_rain: { type: Number }, // 0 or 1
        daily_chance_of_rain: { type: Number }, // Percentage
        condition: {
          text: { type: String, trim: true },
          icon: { type: String, trim: true },
        },
      },
      hour: [{ // Array to hold hourly forecasts for each day
        time: { type: Date, required: true },
        time_epoch: { type: Number },
        temp_c: { type: Number },
        is_day: { type: Number },
        condition: {
          text: { type: String, trim: true },
          icon: { type: String, trim: true },
        },
        will_it_rain: { type: Number }, // 0 or 1
        chance_of_rain: { type: Number }, // Percentage
      }]
    }]
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;