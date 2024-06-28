const todayForecast = document.getElementById('todayForecast');
const weekdayForecast = document.getElementById('weekdayForecast');
const BasicInfoBtn = document.getElementById('BasicInfoBtn');
const detailsBtn = document.getElementById('detailsBtn');
const main = document.getElementById('main');
const accordion = document.getElementsByClassName("accordion");
const cityInp = document.getElementById('cityinp');
const cityList = document.getElementById('cityList');
const submitBtn = document.getElementById('submitBtn');

let isCorrect = false;
let outputInfo;

submitBtn.addEventListener('click', () => {
     if (!cityInp.value == '') {getForecast(cityInp.value); cityList.value = cityInp.value;} 
     else getForecast(cityList.value);
});
BasicInfoBtn.addEventListener('click', () => {
    if (!BasicInfoBtn.classList.contains('used') && isCorrect) {
        renderPage('basicInfo');
        BasicInfoBtn.classList.add('used');
        detailsBtn.classList.remove('used');
    }
});
detailsBtn.addEventListener('click', () => {
    if (!detailsBtn.classList.contains('used') && isCorrect) {
        renderPage('moreInfo');
        detailsBtn.classList.add('used');
        BasicInfoBtn.classList.remove('used');
    }
});

function getForecast(city) {
    const weatherApiKey = '36cfa6bb391b4ce09c9182606243005';
    let weatherUrl = 'http://api.weatherapi.com/v1/forecast.json?key=' + weatherApiKey + '&q=' + city + '&days=7&aqi=no&alerts=no';

    const weather = new XMLHttpRequest();
    weather.open('GET', weatherUrl);
    weather.send();
    weather.onload = function () {
        if (weather.status == 200) {
            outputInfo = JSON.parse(weather.responseText)
            console.log(outputInfo);
            renderPage('basicInfo');
            isCorrect = true;
        }
        else if (weather.status == 400) {
            weekdayForecast.innerHTML = '';
            todayForecast.innerHTML = '<div class="err">Location not found</div>';
            isCorrect = false;
        }
    };
}

function renderPage(reqInfo) {
    BasicInfoBtn.classList.add('used');
    detailsBtn.classList.remove('used');
    main.classList.remove('hot', 'warm', 'cold');
    

    if (outputInfo.current.temp_c > 30) main.classList.add('hot');
    else if (outputInfo.current.temp_c < 20) main.classList.add('warm');
    else if (outputInfo.current.temp_c < 0) main.classList.add('cold');

    if (reqInfo == 'basicInfo') {
        todayForecast.innerHTML = `
            <div class="location-and-date">
                <div class="fa-solid fa-location-dot"></div> ${outputInfo.location.name}, ${outputInfo.location.country} for Today 
                <img class="elemIMG" src="http://${outputInfo.current.condition.icon.split('/').splice(2).join('/')}">
            </div>
            <div class="temperatura"><i class="fa-solid fa-temperature-three-quarters"></i> ${outputInfo.current.temp_c}°C</div>
            <div class="feelslike">Feels like ${outputInfo.current.feelslike_c}°C</div>
            <div class="windforce">Wind force ${outputInfo.current.wind_kph} kilometers and wind direction is ${outputInfo.current.wind_dir}</div>
            <div class="counditionText">${outputInfo.current.condition.text} with ${outputInfo.current.cloud} cloudy level</div>
        `;
    }
    else if (reqInfo == 'moreInfo') {
        todayForecast.innerHTML = `
            <div class="astro"><div class="sunrise"></div> ${outputInfo.forecast.forecastday[0].astro.sunrise}</div>
            <div class="astro"><div class="sunset"></div> ${outputInfo.forecast.forecastday[0].astro.sunset}</div>
            <div>
                <i class="fa-solid fa-temperature-three-quarters"></i>
                Max ${outputInfo.forecast.forecastday[0].day.maxtemp_c}°C.
                Min ${outputInfo.forecast.forecastday[0].day.mintemp_c}°C
            </div>
            <div><i class="fa-solid fa-cloud-rain"></i> Precipitation is ${outputInfo.current.precip_mm} mm</div>
            <div>Air humidity ${outputInfo.current.humidity} %</div>
            <canvas id="temperatureChart"></canvas>
        `;
        drawChart();
    }

    weekdayForecast.innerHTML = '<div class="weekHeader">Forecast for next days</div>';
    for (let i = 1; i < outputInfo.forecast.forecastday.length; ++i) {
        let date = new Date(outputInfo.forecast.forecastday[i].date_epoch * 1000);
        let isActive = i === 1 ? 'active' : '';

        weekdayForecast.innerHTML += `
          <div class="elmWeekdayForecast">
            <div class="accordion ${isActive}">${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}</div>
            <div class="inforoler">
                <div>
                    <i class="fa-solid fa-temperature-three-quarters"></i>
                    Max ${outputInfo.forecast.forecastday[i].day.maxtemp_c}°C
                    Min ${outputInfo.forecast.forecastday[i].day.mintemp_c}°C
                </div>
                <div>   
                    Sunrise: ${outputInfo.forecast.forecastday[i].astro.sunrise}
                    Sunset:${outputInfo.forecast.forecastday[i].astro.sunset}
                </div>
                
                <div class="astro">
                    <img class="elemIMG" src="http://${outputInfo.forecast.forecastday[i].day.condition.icon.split('/').splice(2).join('/')}" alt="">
                    Chance for rain:${outputInfo.forecast.forecastday[i].day.daily_chance_of_rain}%
                </div>
            </div>
          </div>
        `;
    }

    document.querySelectorAll('.elmWeekdayForecast').forEach(function (elm) {
        elm.addEventListener("click", function () {
            let allPanels = document.getElementsByClassName("inforoler");
            for (let j = 0; j < allPanels.length; j++) {
                allPanels[j].style.display = "none";
            }

            let accordions = document.querySelectorAll('.accordion');
            accordions.forEach(function (acc) {
                acc.classList.remove("active");
            });

            this.querySelector('.accordion').classList.toggle("active");
            let panel = this.querySelector('.inforoler');
            if (panel.style.display === "block") panel.style.display = "none";
            else panel.style.display = "block";
        });
    });
}

function drawChart() {
    let ctx = document.getElementById('temperatureChart').getContext('2d');
    let temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [
            '00:00', '01:00',
            '02:00', '03:00',
            '04:00', '05:00',
            '06:00', '07:00',
            '08:00', '09:00',
            '10:00', '11:00',
            '12:00', '13:00',
            '14:00', '15:00',
            '16:00', '17:00',
            '18:00', '19:00',
            '21:00', '22:00',
            '23:00'
        ],
        datasets: [
        {
            label: 'Temperature',
            data: [
                outputInfo.forecast.forecastday[0].hour[0].temp_c,
                outputInfo.forecast.forecastday[0].hour[1].temp_c,
                outputInfo.forecast.forecastday[0].hour[2].temp_c,
                outputInfo.forecast.forecastday[0].hour[3].temp_c,
                outputInfo.forecast.forecastday[0].hour[4].temp_c,
                outputInfo.forecast.forecastday[0].hour[5].temp_c,
                outputInfo.forecast.forecastday[0].hour[6].temp_c,
                outputInfo.forecast.forecastday[0].hour[7].temp_c,
                outputInfo.forecast.forecastday[0].hour[8].temp_c,
                outputInfo.forecast.forecastday[0].hour[9].temp_c,
                outputInfo.forecast.forecastday[0].hour[10].temp_c,
                outputInfo.forecast.forecastday[0].hour[11].temp_c,
                outputInfo.forecast.forecastday[0].hour[12].temp_c,
                outputInfo.forecast.forecastday[0].hour[13].temp_c,
                outputInfo.forecast.forecastday[0].hour[14].temp_c,
                outputInfo.forecast.forecastday[0].hour[15].temp_c,
                outputInfo.forecast.forecastday[0].hour[16].temp_c,
                outputInfo.forecast.forecastday[0].hour[17].temp_c,
                outputInfo.forecast.forecastday[0].hour[18].temp_c,
                outputInfo.forecast.forecastday[0].hour[19].temp_c,
                outputInfo.forecast.forecastday[0].hour[20].temp_c,
                outputInfo.forecast.forecastday[0].hour[20].temp_c,
                outputInfo.forecast.forecastday[0].hour[21].temp_c,
                outputInfo.forecast.forecastday[0].hour[22].temp_c,
                outputInfo.forecast.forecastday[0].hour[23].temp_c
            ],
            backgroundColor: '#ffee38',
            borderColor: '#ffee38',
            borderWidth: 1,
        },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    },
    });
}