let city = "Mumbai";

async function getData() {
  let api_key = `d39302ac32c37c4cbd9d22e8b48e987d`;
  let rawData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`
  );
  let cleanData = await rawData.json();
  console.log(cleanData);
  let cityname = cleanData.name.toLowerCase().trim();
  let temp1 = cleanData.main.temp;
  let feelsLike1 = cleanData.main.feels_like;
  let humidity1 = cleanData.main.humidity;
  let visibility1 = cleanData.visibility;
  let windSpeed1 = cleanData.wind.speed;
  let date = cleanData.dt;
  let time = cleanData.timezone;
  let desc = cleanData.weather[0].description;
  let sunRise = cleanData.sys.sunrise;
  let sunSet = cleanData.sys.sunset;
  let Lat = cleanData.coord.lat;
  let Lon = cleanData.coord.lon;
  let userCity = city.toLowerCase().trim();
  if (userCity !== cityname) {
    throw new Error("Invalid City");
  }
  const openMeteoURL =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${Lat}` +
    `&longitude=${Lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset` +
    `&timezone=auto`;
  let res = await fetch(openMeteoURL);
  let forecastData = await res.json();
  let forecast = {
    time: forecastData.daily.time,
    maxTemp: forecastData.daily.temperature_2m_max,
    minTemp: forecastData.daily.temperature_2m_min,
    weatherCode: forecastData.daily.weathercode,
    sunrise: forecastData.daily.sunrise,
    sunset: forecastData.daily.sunset,
  };

  return {
    city: cityname,
    temp: temp1,
    feelsLike: feelsLike1,
    humidity: humidity1,
    visibility: visibility1,
    windSpeed: windSpeed1,
    time: time,
    date: date,
    desc: desc,
    sunRise: sunRise,
    sunSet: sunSet,
    foreCast: forecast,
  };
}
let temperature = document.querySelector("#temperature");
let cityName = document.querySelector("#cityName");
let dateTime = document.querySelector("#dateTime");
let description = document.querySelector("#description");
let input = document.querySelector("#input");
let windSpeed = document.querySelector("#wind");
let humidity = document.querySelector("#humidity");
let feelsLike = document.querySelector("#feels");
let visibility = document.querySelector("#visibility");
let sunRiseData = document.querySelector("#sunRise");
let sunSetData = document.querySelector("#sunSet");
let errMsg = document.querySelector("#errorMsg");
let foreCastContainer = document.querySelector("#forecast");
let sevenDay = document.querySelector('.sevenDay')
let sixDay = document.querySelector('.sixDay')
let days;

async function setData() {
  try {
    errMsg.style.display = "none";
    data = await getData();
    temperature.innerHTML = data.temp + "°C";
    cityName.innerHTML = '<i class="ri-map-pin-line"></i>' + data.city;
    description.innerHTML = '<i class="ri-heavy-showers-line"></i>' + data.desc;
    windSpeed.innerHTML = data.windSpeed + " m/s";
    humidity.innerHTML = data.humidity + " %";
    feelsLike.innerHTML = data.feelsLike + " °C";
    visibility.innerHTML = data.visibility / 1000 + "km";

    console.log(data);
    console.log(data.foreCast);

    let currentTime = new Date((data.date + data.time) * 1000);
    let formattedDate = currentTime
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })
      .replace("at", "") // comma remove
      .replace("am", "AM") // AM caps
      .replace("pm", "PM");
    dateTime.innerHTML = '<i class="ri-calendar-line"></i>' + formattedDate;

    let sunRise = new Date((data.sunRise + data.time) * 1000);

    let sunRiseTime = sunRise
      .toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })
      .replace("am", "AM")
      .replace("pm", "PM");

    let sunSet = new Date((data.sunSet + data.time) * 1000);

    let sunSetTime = sunSet
      .toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })
      .replace("am", "AM")
      .replace("pm", "PM");

    sunRiseData.innerHTML = sunRiseTime;
    sunSetData.innerHTML = sunSetTime;

    foreCastContainer.innerHTML = "";



    for (let i = 0; i < days; i++) {
        let dateObj = new Date(data.foreCast.time[i]);
        let currDay = dateObj.toLocaleDateString("en-GB", {weekday : "short"});
        
        let currDate = dateObj.toLocaleDateString("en-GB",{
            day : "2-digit",
            month : "short"
        })        
        
        foreCastContainer.innerHTML += 
      `<div class="day">
            <img src="https://www.freeiconspng.com/uploads/weather-icon-png-15.png" alt="">
            <h2>+${data.foreCast.maxTemp[i].toFixed(0)}/+${data.foreCast.minTemp[i].toFixed(0)}</h2>
            <h4>${currDate}</h4>
            <h4>${currDay}</h4>
        </div>`;
    }
  } catch (err) {
    errMsg.innerText = "Please Enter Valid City";
    errMsg.style.display = "block";
    return;
  }
}
setData();



let timer;
input.addEventListener("input", () => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    city = input.value.trim();
    if (city) setData();
  }, 500);
  errMsg.style.display = "none";
});

input.addEventListener("keydown", (dets) => {
  if (dets.key === "Enter") {
    setData();
  }
});

dayFlag = false;
sevenDay.addEventListener('click',()=>{
  if(dayFlag == false){
    sixDay.style.display = "flex"
    dayFlag = true
  }else{
    sixDay.style.display = "none"
    dayFlag = false
  }
})
let newDay;
days = 6
sixDay.addEventListener('click',(e)=>{
  e.stopPropagation();

  let userOpt = e.target.closest('.opt');
  if(!userOpt) return;

  sevenDay.innerHTML = userOpt.innerHTML;
  sixDay.style.display = "none";
  dayFlag = false;

  newDay = Number(userOpt.innerText.replace(" days", ""));
  days = newDay;          // ⭐ yahin kaam ho raha hai
  setData();              // ⭐ forecast dubara render
});

