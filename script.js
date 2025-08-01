let weatherData = {};
let chartInstance;
document.addEventListener("DOMContentLoaded", weatherWidgetApp)
function weatherWidgetApp () { 
  //Default City: Thessaloniki
  fetchWeatherData("Thessaloniki", 40.6436, 22.9309);
  const selectCity = document.getElementById("selectCity");
  selectCity.addEventListener("change", function () {
    const selectedValue = selectCity.value;
    const [cityName, cityLatitude, cityLongitude] = selectedValue.split(',').map(str => str.trim());
    let latitude = parseFloat(cityLatitude);
    let longitude = parseFloat(cityLongitude);
    fetchWeatherData(cityName, latitude, longitude);
  });
}
async function fetchWeatherData(cityName, latitude, longitude) {
    try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,`
          +`apparent_temperature,precipitation_probability,wind_speed_10m,wind_direction_10m,precipitation,weather_code,surface_pressure,`
          +`cloud_cover&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,`
          +`surface_pressure,wind_speed_10m,wind_direction_10m&timezone=Europe/Moscow`);
          console.log(response.data)
        let city = document.getElementById("city");
        city.textContent = cityName;
        getCurrentWeather(response.data);
        const nowButton = document.getElementById("nowButton");
        nowButton.addEventListener("click", () => {
          getCurrentWeather(response.data)});
        const todayButton = document.getElementById("todayButton");
        todayButton.addEventListener("click", () => {
          getDailyWeather(response.data, 0)});
        const selectDate = document.getElementById("selectDate");
        for (i = 1; i < 7; i++){
          selectDate.options[i].label = getForecastDates(response.data)[i-1];
          selectDate.options[i].value = i - 1;
        }
        selectDate.addEventListener("change", () => {
          getDailyWeather(response.data, selectDate.value);
        });
       
        createGraph(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function getCurrentWeather(weatherData){
    getCurrentTemperature(weatherData);
    getApparentTemperature(weatherData);
    getWindSpeed(weatherData);
    getWindDirection(weatherData);
    getPercipitation(weatherData);
    getHumidity(weatherData);
    getPressure(weatherData);
  }
  
  function getDailyWeather(weatherData, dayIndex){
    getAverageTemperature(weatherData, dayIndex);
    getAverageApparentTemperature(weatherData, dayIndex);
    getAverageWindSpeed(weatherData, dayIndex);
    getAverageWindDirection(weatherData, dayIndex);
    getAveragePrecipitation(weatherData, dayIndex);
    getAverageHumidity(weatherData, dayIndex);
    getAveragePressure(weatherData, dayIndex);
    
  }

  function getCurrentTemperature(weatherData) {
    const currentTemperatureField = document.getElementById("currentTemperature");
    currentTemperatureField.innerText = getRoundedValue(weatherData.current.temperature_2m).toString()+" "+getCelsiusUnit(weatherData);
    getWeatherDescription(weatherData);
    getWeatherIcon(weatherData);
  }

  function getWeatherDescription(weatherData){
    const weatherDescriptionField = document.getElementById("weatherDescription");
    let weatherDescription;
    switch(getWeatherCode(weatherData)){
      case 0:
          weatherDescription = "Clear sky";
          break;
      case 1:
          weatherDescription = "Mainly clear";
          break;
      case 2:
          weatherDescription = "Partly Cloudy";
          break;
      case 3:
          weatherDescription = "Overcast";
          break;
      case 45:
          weatherDescription = "Fog";
          break;
      case 48:
          weatherDescription = "Depositing rime fog";
          break;
      case 51:
          weatherDescription = "Light drizzle";
          break;
      case 53:
          weatherDescription = "Moderate drizzle";
          break;
      case 55:
          weatherDescription = "Dense drizzle";
          break;
      case 56:
          weatherDescription = "Dense freezing drizzle";
          break;
      case 57:
          weatherDescription = "Dense freezing drizzle";
          break;
      case 61:
          weatherDescription = "Slight rain";
          break;
      case 63:
          weatherDescription = "Moderate rain";
          break;
      case 65:
          weatherDescription = "Heavy rain";
          break;
      case 66: 
          weatherDescription = "Light freezing rain";
          break;
      case 67: 
          weatherDescription = "Heavy freezing rain";
          break;
      case 71: 
          weatherDescription = "Slight snowfall";
          break;
      case 73:
          weatherDescription = "Moderate snowfall";
          break;
      case 75:
          weatherDescription = "Heavy snowfall";
          break;
      case 77:
          weatherDescription = "Snow grains";
          break;
      case 80: 
          weatherDescription = "Slight rain showers";
          break;
      case 81:
          weatherDescription = "Moderate rain showers";
          break;
      case 82:
          weatherDescription = "Violent rain showers";
          break;
      case 85:
          weatherDescription = "Slight snow showers";
          break;
      case 86:
          weatherDescription = "Heavy snow showers";
          break;
      case 95:
          weatherDescription = "Thunderstorm";
          break;
      case 96:  
          weatherDescription = "Thunderstorm with slight hail";
          break;
      case 99:
          weatherDescription = "Thunderstorm with heavy hail";
          break;
      default:
          weatherDescription = "Description not available currently";          
    }
    weatherDescriptionField.innerText = weatherDescription;
  }

  function getWeatherIcon(weatherData){
    const weatherIconField = document.getElementById("weatherIcon");
    let timeOfDay = "d";
    if (weatherData.current.is_day === 0){
      timeOfDay = "n";
    }
    let weatherIconCode = "";
    switch(getWeatherCode(weatherData)){
      case 0:
          weatherIconCode = "01";
          break;
      case 1:
      case 2:
      case 3:
        const cloudCover = weatherData.current.cloud_cover;
        if (cloudCover > 10 && cloudCover < 26) {
          weatherIconCode = "02";
        } else if (cloudCover > 25 && cloudCover < 51) {
          weatherIconCode = "03";
        } else if (cloudCover > 50){
          weatherIconCode = "04";
        }
        break;
      case 45:
      case 48:
          weatherIconCode = "50";
        break;
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
      case 80:
      case 81:
      case 82:
        weatherIconCode = "09";
        break;
      case 61:
      case 63:
      case 65:
        weatherIconCode = "10";
        break;
      case 66:
      case 67:
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        weatherIconCode = "13";
        break;
      case 95:
      case 96:
      case 99:
        weatherIconCode = "11"
  }
  weatherIconField.src = `https://openweathermap.org/img/wn/${weatherIconCode}${timeOfDay}@4x.png`;
  weatherIconField.alt = getWeatherDescription(weatherData);
}

  function getWeatherCode(weatherData){
    return weatherData.current.weather_code;
  }

  function getApparentTemperature(weatherData){
    const apparentTemperatureField = document.querySelector(".apparentTemperature>h2");
    apparentTemperatureField.innerText = getRoundedValue(weatherData.current.apparent_temperature).toString()+" "+getCelsiusUnit(weatherData);

  }

  function getWindSpeed(weatherData){
    const windSpeedField = document.querySelector(".windSpeed>h2");
    windSpeedField.innerText = weatherData.current.wind_speed_10m+" "+weatherData.current_units.wind_speed_10m;
  }

  function getWindDirection(weatherData){
    const windDirectionField = document.querySelector(".windDegrees>h2");
    windDirectionField.innerText = weatherData.current.wind_direction_10m+weatherData.current_units.wind_direction_10m;
  }

  function getHumidity(weatherData){
    const humidityField = document.querySelector(".humidity>h2");
    humidityField.innerText = weatherData.current.relative_humidity_2m+weatherData.current_units.relative_humidity_2m;
  }

  function getPercipitation(weatherData){
    const precipitationField = document.querySelector(".precipitation>h2");
    precipitationField.innerText = weatherData.current.precipitation+""+weatherData.current_units.precipitation;
  }

  function getPressure(weatherData){
    const pressureField = document.querySelector(".pressure>h2");
    pressureField.innerText = weatherData.current.surface_pressure+" "+weatherData.current_units.surface_pressure;
  }

  function getAverageTemperature(weatherData, dayIndex){
    const averageTemperatureField = document.getElementById("currentTemperature");
    const averageTemperature = getRoundedValue(getArrayAverage(getForecastTemperatures(weatherData)[dayIndex]));
    averageTemperatureField.innerText = averageTemperature.toString()+" "+getCelsiusUnit(weatherData);
    getDailyWeatherCode(weatherData, dayIndex);
    getDailyWeatherIcon(weatherData, dayIndex);
    getDailyWeatherDescription(weatherData, dayIndex);
  }

  function getDailyWeatherCode(weatherData, dayIndex){
    return weatherData.hourly.weather_code[dayIndex * 24 + 12];
  }


  function getDailyWeatherIcon(weatherData, dayIndex){
    const weatherIconField = document.getElementById("weatherIcon");
    let timeOfDay = "d";
    let weatherIconCode = "";
    switch(getDailyWeatherCode(weatherData, dayIndex)){
      case 0:
          weatherIconCode = "01";
          break;
      case 1:
      case 2:
      case 3:
        const cloudCover = weatherData.hourly.cloud_cover[dayIndex * 24 + 12];
        if (cloudCover > 10 && cloudCover < 26) {
          weatherIconCode = "02";
        } else if (cloudCover > 25 && cloudCover < 51) {
          weatherIconCode = "03";
        } else if (cloudCover > 50){
          weatherIconCode = "04";
        }
        break;
      case 45:
      case 48:
          weatherIconCode = "50";
          break;
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
      case 80:
      case 81:
      case 82:
        weatherIconCode = "09";
        break;
      case 61:
      case 63:
      case 65:
        weatherIconCode = "10";
        break;
      case 66:
      case 67:
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        weatherIconCode = "13";
        break;
      case 95:
      case 96:
      case 99:
        weatherIconCode = "11"
  }
  weatherIconField.src = `https://openweathermap.org/img/wn/${weatherIconCode}${timeOfDay}@4x.png`;
  weatherIconField.alt = getDailyWeatherDescription(weatherData, dayIndex);
}

function getDailyWeatherDescription(weatherData, dayIndex){
  const weatherDescriptionField = document.getElementById("weatherDescription");
  let weatherDescription;
  switch(getDailyWeatherCode(weatherData, dayIndex)){
    case 0:
        weatherDescription = "Clear sky";
        break;
    case 1:
        weatherDescription = "Mainly clear";
        break;
    case 2:
        weatherDescription = "Partly Cloudy";
        break;
    case 3:
        weatherDescription = "Overcast";
        break;
    case 45:
        weatherDescription = "Fog";
        break;
    case 48:
        weatherDescription = "Depositing rime fog";
        break;
    case 51:
        weatherDescription = "Light drizzle";
        break;
    case 53:
        weatherDescription = "Moderate drizzle";
        break;
    case 55:
        weatherDescription = "Dense drizzle";
        break;
    case 56:
        weatherDescription = "Dense freezing drizzle";
        break;
    case 57:
        weatherDescription = "Dense freezing drizzle";
        break;
    case 61:
        weatherDescription = "Slight rain";
        break;
    case 63:
        weatherDescription = "Moderate rain";
        break;
    case 65:
        weatherDescription = "Heavy rain";
        break;
    case 66: 
        weatherDescription = "Light freezing rain";
        break;
    case 67: 
        weatherDescription = "Heavy freezing rain";
        break;
    case 71: 
        weatherDescription = "Slight snowfall";
        break;
    case 73:
        weatherDescription = "Moderate snowfall";
        break;
    case 75:
        weatherDescription = "Heavy snowfall";
        break;
    case 77:
        weatherDescription = "Snow grains";
        break;
    case 80: 
        weatherDescription = "Slight rain showers";
        break;
    case 81:
        weatherDescription = "Moderate rain showers";
        break;
    case 82:
        weatherDescription = "Violent rain showers";
        break;
    case 85:
        weatherDescription = "Slight snow showers";
        break;
    case 86:
        weatherDescription = "Heavy snow showers";
        break;
    case 95:
        weatherDescription = "Thunderstorm";
        break;
    case 96:  
        weatherDescription = "Thunderstorm with slight hail";
        break;
    case 99:
        weatherDescription = "Thunderstorm with heavy hail";
        break;
    default:
        weatherDescription = "Description not available currently";          
  }
  weatherDescriptionField.innerText = weatherDescription;
}

  function getAverageApparentTemperature(weatherData, dayIndex){
    const averageApparentTemperatureField = document.querySelector(".apparentTemperature h2");
    const averageApparentTemperature = getRoundedValue(getArrayAverage(getForecastApparentTemperatures(weatherData)[dayIndex]));
    console.log(averageApparentTemperature)
    averageApparentTemperatureField.innerText = averageApparentTemperature.toString()+" "+getCelsiusUnit(weatherData);
  }

  function getAverageWindSpeed(weatherData, dayIndex){
    const averageWindSpeedField = document.querySelector(".windSpeed h2");
    const averagewindSpeed = getRoundedValue(getArrayAverage(getForecastWindSpeeds(weatherData)[dayIndex]));
    averageWindSpeedField.innerText = averagewindSpeed.toString()+" "+weatherData.current_units.wind_speed_10m;
  }

  function getAverageWindDirection(weatherData, dayIndex){
    const averageWindDirectionField = document.querySelector(".windDegrees h2");
    const averageWindDirection = getRoundedValue(getArrayAverage(getForecastWindDirections(weatherData)[dayIndex]));
    averageWindDirectionField.innerText = averageWindDirection.toString()+" "+weatherData.current_units.wind_direction_10m;
  }

  function getAverageHumidity (weatherData, dayIndex){
    const averageHumidityField = document.querySelector(".humidity h2");
    const averageHumidity = getRoundedValue(getArrayAverage(getForecastHumidity(weatherData)[dayIndex]));
    averageHumidityField.innerText = averageHumidity.toString()+" "+weatherData.current_units.relative_humidity_2m;
  }

  function getAveragePrecipitation (weatherData, dayIndex){
    const averagePrecipitationField = document.querySelector(".precipitation h2");
    const averagePrecipitation = getRoundedValue(getArrayAverage(getForecastPrecipitation(weatherData)[dayIndex]));
    averagePrecipitationField.innerText = averagePrecipitation.toString()+" "+weatherData.current_units.precipitation;
  }

  function getAveragePressure (weatherData, dayIndex){
    const averagePressureField = document.querySelector(".pressure h2");
    const averagePressure = getRoundedValue(getArrayAverage(getForecastPressure(weatherData)[dayIndex]));
    averagePressureField.innerText = averagePressure.toString()+" "+weatherData.current_units.surface_pressure;
  }

  function getCelsiusUnit(weatherData){
    return weatherData.current_units.temperature_2m;
  }

  function createGraph(weatherData){
    resetCanvas();
    const ctx = document.getElementById("weatherChart");
    const weeklyForecastDates = getForecastDates(weatherData);
    const weeklyForecastTemperatures = getAverageForecastTemperaturesPerDay(getForecastTemperatures(weatherData).slice(1));
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: weeklyForecastDates,
        datasets: [{
          label: 'Temperature',
          data: weeklyForecastTemperatures,
          borderWidth: 2,
          borderColor: "orange"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function resetCanvas() {
    const chartContainer = document.getElementById("chartContainer");
    const previousCanvas = document.getElementById("weatherChart");
      previousCanvas.remove();
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "weatherChart";
    chartContainer.appendChild(newCanvas);
  }

  function getForecastDates(weatherData){
    const timeTable = weatherData.hourly.time;
    const forecastDates = [];
    for (let i = 24; i < timeTable.length;){ 
      const date = timeTable[i].substring(0,timeTable[i].indexOf("T"));
      forecastDates.push(reverseDate(timeTable[i].substring(0,timeTable[i].indexOf("T"))));
      i = i + 24;
    }
    return forecastDates;
  }

  function getForecastTemperatures(weatherData){
    const temperatureTable = weatherData.hourly.temperature_2m;
    const forecastTemperatures = [];
    for (let i = 0; i < temperatureTable.length;){
      const dailyTemperatures = [];
      for (let j = 0; j < 24; j++){
        dailyTemperatures.push(temperatureTable[i+j])
      }
      forecastTemperatures.push(dailyTemperatures);
      i = i + 24;
    }
    return forecastTemperatures;
  }
  
  function getForecastApparentTemperatures(weatherData){
    const apparentTemperatureTable = weatherData.hourly.apparent_temperature;
    const forecastApparentTemperatures = [];
    for (let i = 0; i < apparentTemperatureTable.length;){
      const dailyApparentTemperatures = [];
      for (let j = 0; j < 24; j++){
        dailyApparentTemperatures.push(apparentTemperatureTable[i+j])
      }
      forecastApparentTemperatures.push(dailyApparentTemperatures);
      i = i + 24;
    }
    return forecastApparentTemperatures;
  }

  function getForecastWindSpeeds(weatherData){
    const windSpeedTable = weatherData.hourly.wind_speed_10m;
    const forecastWindSpeeds = [];
    for (let i = 0; i < windSpeedTable.length;){
      const dailyWindSpeeds = [];
      for (let j = 0; j < 24; j++){
        dailyWindSpeeds.push(windSpeedTable[i+j])
      }
      forecastWindSpeeds.push(dailyWindSpeeds);
      i = i + 24;
    }
    return forecastWindSpeeds;
  }

  function getForecastWindDirections(weatherData){
    const windDirectionTable = weatherData.hourly.wind_direction_10m;
    const forecastWindDirections = [];
    for (let i = 0; i < windDirectionTable.length;){
      const dailyWindDirections = [];
      for (let j = 0; j < 24; j++){
        dailyWindDirections.push(windDirectionTable[i+j])
      }
      forecastWindDirections.push(dailyWindDirections);
      i = i + 24;
    }
    return forecastWindDirections;
  }

  function getForecastHumidity(weatherData){
    const humidityTable = weatherData.hourly.relative_humidity_2m;
    const forecastHumidity = [];
    for (let i = 0; i < humidityTable.length;){
      const dailyHumidity = [];
      for (let j = 0; j < 24; j++){
        dailyHumidity.push(humidityTable[i+j])
      }
      forecastHumidity.push(dailyHumidity);
      i = i + 24;
    }
    return forecastHumidity;
  }

  function getForecastPrecipitation(weatherData){
    const precipitationTable = weatherData.hourly.precipitation;
    const forecastPrecipitation = [];
    for (let i = 0; i < precipitationTable.length;){
      const dailyPrecipitation = [];
      for (let j = 0; j < 24; j++){
        dailyPrecipitation.push(precipitationTable[i+j])
      }
      forecastPrecipitation.push(dailyPrecipitation);
      i = i + 24;
    }
    return forecastPrecipitation;
  }

  function getForecastPressure(weatherData){
    const pressureTable = weatherData.hourly.surface_pressure;
    const forecastPressure = [];
    for (let i = 0; i < pressureTable.length;){
      const dailyPressure = [];
      for (let j = 0; j < 24; j++){
        dailyPressure.push(pressureTable[i+j])
      }
      forecastPressure.push(dailyPressure);
      i = i + 24;
    }
    return forecastPressure;
  }


  function reverseDate(date) {
    const dateArray = date.split("-");
    [dateArray[0], dateArray[2]] = [dateArray[2], dateArray[0]];
    return dateArray.join("-");
  }
  
  function getAverageForecastTemperaturesPerDay(getForecastTemperatures){
    const averageTemperatures = [];
    for (let i = 0; i < getForecastTemperatures.length; i++){
      averageTemperatures.push(getArrayAverage(getForecastTemperatures[i]));
    }
    return averageTemperatures;
  }

  function getArrayAverage(array){
    let sum = 0;
    for (let i = 0; i < array.length; i++){
      sum += array[i];
    }
    return sum/array.length;
  }

  function getRoundedValue(decimal){
    if ((decimal - Math.floor(decimal)) < 0.5) {
      return Math.floor(decimal)
    }else {
      return Math.ceil(decimal)
    }
  }
