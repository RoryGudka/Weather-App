import './App.css';
import API_KEY from './keys.js';
import { useState, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {nanoid} from "nanoid";



function App() {
  const [current, setCurrent] = useState(null);
  const [weather, setWeather] = useState(null);
  const [selection, setSelection] = useState("daily");
  const [searchQuery, setSearchQuery] = useState("");



  const handleSearch = e => {
    if(isNaN(parseInt(searchQuery))) {
      const url = new URL("https://api.openweathermap.org/data/2.5/weather?");
      url.searchParams.append("q", searchQuery);
      url.searchParams.append("appid", API_KEY);
      url.searchParams.append("units", "imperial");
      fetch(url).then(res => {
        return res.json();
      }).then(obj => {
        if(!obj.base) {
          alert("No results found");
        }
        else {
          setCurrent(obj);
          const url = new URL("https://api.openweathermap.org/data/2.5/onecall?");
          url.searchParams.append("lat", obj.coord.lat);
          url.searchParams.append("lon", obj.coord.lon);
          url.searchParams.append("appid", API_KEY);
          url.searchParams.append("units", "imperial");
          fetch(url).then(res => {
            return res.json();
          }).then(obj => {
            setWeather(obj);
          });
        }
      });
    }
    else {
      const url = new URL("https://api.openweathermap.org/data/2.5/weather?");
      url.searchParams.append("zip", searchQuery);
      url.searchParams.append("appid", API_KEY);
      url.searchParams.append("units", "imperial");
      fetch(url).then(res => {
        return res.json();
      }).then(obj => {
        if(!obj.base) {
          alert("No results found");
        }
        else {
          setCurrent(obj);
          const url = new URL("https://api.openweathermap.org/data/2.5/onecall?");
          url.searchParams.append("lat", obj.coord.lat);
          url.searchParams.append("lon", obj.coord.lon);
          url.searchParams.append("appid", API_KEY);
          url.searchParams.append("units", "imperial");
          fetch(url).then(res => {
            return res.json();
          }).then(obj => {
            setWeather(obj);
          });
        }
      });
    }
  }

  const handleSelection = (event, newSelection) => {
    if(newSelection !== null) {
      setSelection(newSelection);
    }
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let daysOfWeek = [];
  let curDate = new Date();
  for(let i = 0; i < 8; i++) {
    daysOfWeek[i] = days[curDate.getDay()];
    curDate = new Date(curDate.setDate(curDate.getDate() + 1));
  }
  let index = 0;
  const daily = weather !== null && weather.daily.map(day => (
    <div key={nanoid()} className="dayWrapper">
      <Paper style={{padding:"1px 20px"}}elevation={3}>
        {day.weather[0].main === "Clouds" ? <i className="big fas fa-cloud"></i> : day.weather[0].main === "Rain" ? <i className="big fas fa-cloud-showers-heavy"></i> : day.weather[0].main === "Clear" ? <i className="big fas fa-sun"></i>: ""}
        <h1>{daysOfWeek[index++]}</h1>
        <br></br>
        <p>{"Morning: " + day.temp.morn + "°F"}</p>
        <p>{"Day: " + day.temp.day + "°F"}</p>
        <p>{"Evening: " + day.temp.eve + "°F"}</p>
        <p>{"Night: " + day.temp.night + "°F"}</p>
        <p>{"Min: " + day.temp.min + "°F"}</p>
        <p>{"Max: " + day.temp.max + "°F"}</p>
        <p>{"Humidity: " + day.humidity + "%"}</p>
        <p>{"Pressure: " + day.pressure}</p>
      </Paper>
    </div>
  ));
    
  let hours = [(new Date()).getHours()];
  for(let i = 1; i < 49; i++) {
    if(hours[i - 1] !== 24) hours[i] = hours[i - 1] + 1;
    else hours[i] = 0;
  }
  for(let i = 0; i < hours.length; i++) {
    if(hours[i] > 12) hours[i] = hours[i] - 12 + ":00 PM";
    else hours[i] = hours[i] + ":00 AM";
  }



  index = 0;
  const hourly = weather !== null && weather.hourly.map(hour => (
    <div key={nanoid()} className="hourWrapper">
      {hour.weather[0].main === "Clouds" ? <i className="fas fa-cloud"></i> : hour.weather[0].main === "Rain" ? <i className="fas fa-cloud-showers-heavy"></i> : hour.weather[0].main === "Clear" ? <i className="fas fa-sun"></i>: ""}
      <p><b>{hours[index++]}</b></p>
      <p>{"Temperature: " + hour.temp + "°F"}</p>
      <p>{"Feels Like: " + hour.feels_like + "°F"}</p>
      <p>{"Humidity: " + hour.humidity + "%"}</p>
      <p>{"Pressure: " + hour.pressure}</p>
    </div>
  ));
  return (
    <div>
      <div id="searchContainer">
        <div id="searchWrapper">
          <TextField placeholder="Zip Code or City" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
      </div>
      {
          current !== null && (
          <div id="currentWrapper">
            <Paper style={{padding:"1px 20px"}} elevation={3}>
              <p>{"Curernt Temperature: " + current.main.temp + "°F"}</p>
              <p>{"High: " + current.main.temp_max + "°F"}</p>
              <p>{"Low: " + current.main.temp_min + "°F"}</p>
              <p>{"Feels Like: " + current.main.feels_like + "°F"}</p>
              <p>{"Humidity: " + current.main.humidity + "%"}</p>
              <p>{"Pressure: " + current.main.pressure}</p>
            </Paper>
          </div>
        )
      }
      <div id="selectionMenu">
        <ToggleButtonGroup value={selection} exclusive onChange={handleSelection}>
            <ToggleButton value="daily">Daily</ToggleButton>
            <ToggleButton value="hourly">Hourly</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        {selection === "daily" ? daily : (
          <Paper style={{left:"10%", width:"80%", marginTop:"30px"}} elevation={3}>
            {hourly}
          </Paper>
        )}
      </div>
    </div>
  );
}

export default App;
