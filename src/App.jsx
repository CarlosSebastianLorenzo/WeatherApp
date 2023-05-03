import './App.css'
import { useState } from 'react';
import { Box, Container, TextField, Typography } from "@mui/material"
import { LoadingButton } from '@mui/lab';

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&lang=es&q=`;

function App() {

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: ""
  });
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: 0,
    condition: "",
    icon: "",
    conditionText: "",
    region: "",
  })

  const onSubmit = async(e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);
    try{
      if(!city.trim()) throw { message: "Please enter a city"};
      
      const response = await fetch(API_WEATHER + city);
      const data = await response.json();
      
      if (data.error) throw { message: data.error.message};

      console.log(data)

      setWeather({
        city: data.location.name,
        country: data.location.country,
        region: data.location.region,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text
      });
    }
    catch(err){
      setError({
        error: true,
        message: err.message
      });
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="xs"
      sx={{mt:2}}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
        >
        Weather App
      </Typography>
      <Box
        sx={{display: "grid", gap: 2}}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="City"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="loading..."
        >
          Search
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box
          sx={{
            mt:2,
            display: "grid",
            gap: 2,
            textAlign: "center"
          }}
        >
          <Typography
            variant="h4"
            component="h2"
          >
            {weather.city}, {weather.region}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{
              margin: "0 auto"
            }}
          />
            <Typography
              variant="h5"
              component="h3"
            >
              {weather.temp} °C
            </Typography>
            <Typography
              variant="h6"
              component="h4"
            >
              {weather.conditionText}
            </Typography>
          
        </Box>
      )}
      <Typography
        textAlign="center"
        sx={{ mt: 2, fontSize: "10px" }}
      >
        Powered by:{" "}
        <a
          target="blank"
          href="https://www.weatherapi.com/"
          title="Weather API"
        >
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  )
}

export default App