const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';
const units = 'metric';

document.getElementById('search-btn').addEventListener('click', fetchWeatherData);

async function fetchWeatherData() {
    const city = document.getElementById('city-input').value.trim();

    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    try {
        showLoading();

        // Fetch current weather
        const currentWeatherResponse = await fetch(`${baseUrl}weather?q=${city}&appid=${apiKey}&units=${units}`);
        const currentWeatherData = await currentWeatherResponse.json();

        if (!currentWeatherResponse.ok) throw new Error(currentWeatherData.message);

        // Display current weather
        displayCurrentWeather(currentWeatherData);

        // Fetch 5-day forecast
        const forecastResponse = await fetch(`${baseUrl}forecast?q=${city}&appid=${apiKey}&units=${units}`);
        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) throw new Error(forecastData.message);

        // Display 5-day forecast
        displayForecast(forecastData);

        hideLoading();
    } catch (error) {
        hideLoading();
        alert(error.message || 'An error occurred while fetching weather data.');
    }
}

function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleString();
    document.getElementById('temperature').textContent = `${data.main.temp}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('current-weather').classList.remove('hidden');
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    dailyData.forEach(item => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <p>${item.main.temp}°C</p>
            <p>${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });

    document.getElementById('forecast-weather').classList.remove('hidden');
}

function showLoading() {
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    document.body.style.cursor = 'default';
}
