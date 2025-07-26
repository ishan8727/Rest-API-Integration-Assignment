const filterWeather = (weatherForecast) => {
    const filteredData = {
        location: {
            name: weatherForecast.location.name,
            region: weatherForecast.location.region,
            country: weatherForecast.location.country
        },
        current: {
            temp_c: weatherForecast.current.temp_c,
            condition: {
                text: weatherForecast.current.condition.text,
                icon: weatherForecast.current.condition.icon
            },
            humidity: weatherForecast.current.humidity
        },
        forecast: {
            forecastday: weatherForecast.forecast.forecastday.map(day => ({
                date: day.date,
                date_epoch: day.date_epoch,
                day: {
                    maxtemp_c: day.day.maxtemp_c,
                    mintemp_c: day.day.mintemp_c,
                    avgtemp_c: day.day.avgtemp_c,
                    daily_will_it_rain: day.day.daily_will_it_rain,
                    daily_chance_of_rain: day.day.daily_chance_of_rain,
                    condition: {
                        text: day.day.condition.text,
                        icon: day.day.condition.icon
                    }
                },
                hour: day.hour.map(h => ({
                    time: h.time,
                    time_epoch: h.time_epoch,
                    temp_c: h.temp_c,
                    is_day: h.is_day,
                    condition: {
                        text: h.condition.text,
                        icon: h.condition.icon
                    },
                    will_it_rain: h.will_it_rain,
                    chance_of_rain: h.chance_of_rain
                }))
            }))
        }
    };
    return filteredData;
}

module.exports = filterWeather;
