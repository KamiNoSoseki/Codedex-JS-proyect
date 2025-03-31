async function fetchWeather() {
    let searchInput = document.getElementById("buscar").value;
    const weatherDataSection = document.getElementById("info-clima");
    weatherDataSection.style.display = "block";
    const apiKey = "9af8223176e24e6c1e596a22667fa8bf"; 

    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
          <h2>Búsqueda vacia</h2>
          <p>Intenta de nuevo con una <u>ciudad válida</u>.</p>
        </div>
        `;
        return;
    }

    async function getLonAndLat() {
        const countryCode = 57;
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

        const response = await fetch(geocodeURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        if (data.length == 0) {
            console.log("Algo salió mal");
            weatherDataSection.innerHTML = `
            <div>
              <h2>Entrada inválida: "${searchInput}"</h2>
              <p>Intenta de nuevo con una <u>ciudad válida</u>.</p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }
    }
  
    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const response = await fetch(weatherURL);

        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }
        
        const data = await response.json();

        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
        <h2>${data.name}</h2>
        <p><strong>Temperatura:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Descripción:</strong> ${data.weather[0].description}</p>
        </div>`
    }
    
    document.getElementById("buscar").value = "";
    const geocodeData = await getLonAndLat();
    getWeatherData(geocodeData.lon, geocodeData.lat);
    
}

