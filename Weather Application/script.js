const timeEl = document.querySelector("#time");
const dateEl = document.querySelector("#date");
const currentWeatherItems = document.querySelector("#current-weather-items");
const timezone = document.querySelector("#time-zone");
const weatherForecast = document.querySelector("#weather-forecast");
const currentTempEl = document.querySelector("#current-temp");
const today = document.querySelector('.today');
const cityInput = document.querySelector('.location');
const currLocationBtn = document.querySelector('.current-loc-btn');
const cityName = document.querySelector('.time-zone');
const countryCode = document.querySelector('.country');

const Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12Format = hour >= 13 ? hour % 12 : hour;
    const am_pm = hour >= 12 ? "PM" : "AM";
    const minutes = time.getMinutes().toString().padStart(2, '0');
    
    timeEl.innerHTML = `${hoursIn12Format}:${minutes} <span id="am-pm">${am_pm}</span>`;
    dateEl.innerHTML = `${Days[day]}, ${date} ${Months[month]}`;
}, 1000);

window.addEventListener('load', () => {
    getCurrentLocationWeather();
});

currLocationBtn.addEventListener("click", () => {
    getCurrentLocationWeather();
});


let latitude;
let longitude;

const getCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition((success) => {
        latitude = success.coords.latitude;
        longitude = success.coords.longitude;
        const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${latitude}&lon=${longitude}&accept-language=en&polygon_threshold=0.0`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'fe47d6868cmsh977e46bd0aec11dp17f6cdjsn69576db7c6be',
                'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
            }
        };
        
        fetch(url, options).then(res => res.json())
        .then(data => {
            const cc = data.address.country_code.toUpperCase();
            countryCode.innerHTML = cc
            if(data.address.city){
                cityName.innerHTML = `${data.address.city}`
            }
            else{
                cityName.innerHTML = `${data.address.state}`
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        getWeatherData(latitude, longitude);
    });
};


const fetchWeatherbyCity = (city) => {
    cityName.innerHTML = `${city}`
    const API_KEY = '597dd4c21f6b48ad9fafeb43112c07cc';
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${city}&lang=en&limit=10&type=city&apiKey=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const { lat, lon } = data.features[0].properties;
                getWeatherData(lat, lon);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

const getWeatherData = (latitude, longitude) => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max,precipitation_probability_max,uv_index_max&hourly=relative_humidity_2m,pressure_msl`)
        .then(res => res.json())
        .then(data => {
            showWeatherData(data);
        })
        .catch(error => {
            console.error(error);
        });
};


const showWeatherData = (data) => {
    const daily = data.daily;
    const temperature_2m_max = daily.temperature_2m_max;
    const temperature_2m_min = daily.temperature_2m_min;
    const uv_index = daily.uv_index_max;
    const wind_speed_10m_max = daily.wind_speed_10m_max;
    const precipitation = daily.precipitation_probability_max;
    
    const hourly = data.hourly;
    const pressure = hourly.pressure_msl;
    const relative_humidity_2m = hourly.relative_humidity_2m;

    const convertToIST = (utcTime) => {
        let date = new Date(utcTime);
        let offset = 5.5 * 60 * 60 * 1000; // IST offset is 5 hours 30 minutes
        date = new Date(date.getTime() + offset);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    const sunrise = convertToIST(daily.sunrise[0]);
    const sunset = convertToIST(daily.sunset[0]);


    currentWeatherItems.innerHTML = `<div class="weather-item">
                                        <p>Humidity</p>
                                        <p>${relative_humidity_2m[0]} %</p>
                                    </div>
                                    <div class="weather-item">
                                        <p>Pressure</p>
                                        <p>${pressure[0]} hPa</p>
                                    </div>
                                    <div class="weather-item">
                                        <p>Wind Speed</p>
                                        <p>${wind_speed_10m_max[0]} km/hr</p>
                                    </div>
                                    <div class="weather-item">
                                        <p>Sunrise</p>
                                        <p>${sunrise}</p>
                                    </div>
                                    <div class="weather-item">
                                        <p>Sunset</p>
                                        <p>${sunset}</p>
                                    </div>`
                                    
    today.innerHTML = `
                        <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="icon">
                        <div class="other">
                            <div class="day">${Days[new Date().getDay()]}</div>
                            <div class="temp-items">Day - ${temperature_2m_max[0]}&#176; C</div>
                            <div class="temp-items">Night - ${temperature_2m_min[0]}&#176; C</div>
                            <div class="temp-items">Precipitation - ${precipitation[0]}%</div>
                            <div class="temp-items">UV Index - ${uv_index[0]}</div>
                        </div>`;

                        let ans;
                        for(let i=0;i<7;i++){
                            if(Days[i]==Days[new Date().getDay()]){
                                ans = i;
                            }
                        }

    weatherForecast.innerHTML = `<div class="weather-forecast-item">
                                    <div class="day">${Days[(ans+1)%7]}</div>
                                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="icon">
                                    <div class="temp">Day-${temperature_2m_max[1]}&#176;C</div>
                                    <div class="temp">Night-${temperature_2m_min[1]}&#176;C</div>
                                </div>
                                <div class="weather-forecast-item">
                                    <div class="day">${Days[(ans+2)%7]}</div>
                                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="icon">
                                    <div class="temp">Day-${temperature_2m_max[2]}&#176;C</div>
                                    <div class="temp">Night-${temperature_2m_min[2]}&#176;C</div>
                                </div><div class="weather-forecast-item">
                                <div class="day">${Days[(ans+3)%7]}</div>
                                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="icon">
                                    <div class="temp">Day-${temperature_2m_max[3]}&#176;C</div>
                                    <div class="temp">Night-${temperature_2m_min[3]}&#176;C</div>
                                </div><div class="weather-forecast-item">
                                <div class="day">${Days[(ans+4)%7]}</div>
                                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="icon">
                                    <div class="temp">Day-${temperature_2m_max[4]}&#176;C</div>
                                    <div class="temp">Night-${temperature_2m_min[4]}&#176;C</div>
                                </div><div class="weather-forecast-item">
                                <div class="day">${Days[(ans+5)%7]}</div>
                                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="icon">
                                    <div class="temp">Day-${temperature_2m_max[5]}&#176;C</div>
                                    <div class="temp">Night-${temperature_2m_min[5]}&#176;C</div>
                                </div><div class="weather-forecast-item">
                                    <div class="day">${Days[(ans+6)%7]}</div>
                                    <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather-icon" class="icon">
                                    <div class="temp">Day-${temperature_2m_max[6]}&#176;C</div>
                                    <div class="temp">Night-${temperature_2m_min[6]}&#176;  C</div>
                                </div>
                                `
}

cityInput.addEventListener("input", () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherbyCity(city);
    }
});