import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { fetchCoordinatesData, fetchWeatherData } from './utils/apiService';

interface WeatherAppProps {
  priv: string;
}

interface CoordinatesData {
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
}

interface WeatherData {
  list: {
    dt_txt: string;
    weather: {
      id: number;
      description: string;
    }[];
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
  }[];
}

const POLLING_INTERVAL = 600000; // 10 minutes in milliseconds

const WeatherApp: React.FC<WeatherAppProps> = ({ priv }) => {
  const [coordinatesData, setCoordinatesData] = useState<CoordinatesData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const apiKey: string = priv;

  const handleFetchData = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (event.key === 'Enter') {
      if (location.trim() === '') {
        setFeedbackMessage('Please enter a location');
        return;
      }
      try {
        const data = await fetchCoordinatesData(location, apiKey);
        setCoordinatesData(data);
        setFeedbackMessage('');
      } catch (error) {
        console.error('Error fetching coordinate data:', error);
        setFeedbackMessage('Please provide valid location name');
      }
    }
  };

  const getMonthDay = (date: string): string => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;

    return `${month}/${day}`;
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (coordinatesData) {
        try {
          const { lat, lon } = coordinatesData.coord;
          const wdata = await fetchWeatherData(lat, lon, apiKey);
          setWeatherData(wdata);
        } catch (error) {
          console.error('Error fetching weather data:', error);
          setFeedbackMessage('Error fetching weather data');
        }
      }
    };

    const fetchDataAndStartPolling = async (): Promise<() => void> => {
      await fetchData();
      const interval = setInterval(fetchData, POLLING_INTERVAL);

      return () => clearInterval(interval);
    };

    fetchDataAndStartPolling();
  }, [coordinatesData, apiKey]);
  return (
    <div>
      <Head>
        <title>Weather App</title>
      </Head>
  
      <main>
        <div className="app">
          <div className="overlay">
            <div className="div">
            {weatherData && (
              <>
                <div className="conditions-container">
                  <div className="cloud-cover al-self col-center">
                    <i className={`wi wi-owm-${weatherData?.list?.[0]?.weather?.[0]?.id}`}></i>
                    <p aria-label="tempLabel">{`${Math.trunc(weatherData?.list?.[0]?.main?.temp)}°F`}</p>
                    {weatherData?.list?.[0]?.weather?.[0]?.description}
                  </div>
                  <div className="location">
                    <p>{coordinatesData?.name}</p>
                  </div>
                </div>
  
                <div className="conditions-container">
                  <div className="feels">
                    <label htmlFor='feelsLabel'>real feel</label>
                    <p aria-label="feelsLabel">{`${Math.trunc(weatherData?.list?.[0]?.main?.feels_like)}°F`}</p>
                  </div>
                  <div className="humidity">
                    <label htmlFor="humidityLabel">humidity</label>
                    <p aria-label="humidityLabel">{`${Math.trunc(weatherData?.list?.[0]?.main?.humidity)}%`}</p>
                  </div>
                  <div className="wind">
                    <label htmlFor="windLabel">wind</label>
                    <p aria-label="windyLabel">{`${Math.trunc(weatherData?.list?.[0]?.wind?.speed)} knots`}</p>
                  </div>
                </div>
              </>
            )}
  
            <div className="searchbox">
              <input
                value={location}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setLocation(event.target.value)}
                onKeyPress={handleFetchData}
                placeholder="Enter city or location"
                type="text"
              />
              {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
            </div>
            </div>
  
            {weatherData && (
              <>
                <div className='div-bottom'>
                  <div className='conditions-container'>
                    <p className="forecast-title">Upcoming forecast:</p>
                  </div>
                  <div className='conditions-container'>
                    <div className='day'>
                      <div>
                        <p aria-label="dateLabel">{getMonthDay(weatherData?.list?.[15]?.dt_txt)}</p>
                      </div>
                      <div className="al-self">
                        <i className={`wi wi-owm-${weatherData?.list?.[15]?.weather?.[0]?.id}`}></i>
                      </div>
                      <div>
                        <p aria-label="tempLabel">{`${Math.trunc(weatherData?.list?.[15]?.main?.temp)}°F`}</p>
                        {weatherData?.list?.[15]?.weather?.[0]?.description}
                      </div>
                    </div>
                    <div className='day'>
                      <div>
                        <p aria-label="dateLabel">{getMonthDay(weatherData?.list?.[23]?.dt_txt)}</p>
                      </div>
                      <div className="al-self">
                        <i className={`wi wi-owm-${weatherData?.list?.[23]?.weather?.[0]?.id}`}></i>
                      </div>
                      <div>
                        <p aria-label="tempLabel">{`${Math.trunc(weatherData?.list?.[23]?.main?.temp)}°F`}</p>
                        {weatherData?.list?.[23]?.weather?.[0]?.description}
                      </div>
                    </div>
                    <div className='day'>
                      <div>
                        <p aria-label="dateLabel">{getMonthDay(weatherData?.list?.[31]?.dt_txt)}</p>
                      </div>
                      <div className="al-self">
                        <i className={`wi wi-owm-${weatherData?.list?.[31]?.weather?.[0]?.id}`}></i>
                      </div>
                      <div>
                        <p aria-label="tempLabel">{`${Math.trunc(weatherData?.list?.[31]?.main?.temp)}°F`}</p>
                        {weatherData?.list?.[31]?.weather?.[0]?.description}
                      </div>
                    </div>
                    <div className='day'>
                      <div>
                        <p aria-label="dateLabel">{getMonthDay(weatherData?.list?.[38]?.dt_txt)}</p>
                      </div>
                      <div className="al-self">
                        <i className={`wi wi-owm-${weatherData?.list?.[38]?.weather?.[0]?.id}`}></i>
                      </div>
                      <div>
                        <p aria-label="tempLabel">{`${Math.trunc(weatherData?.list?.[38]?.main?.temp)}°F`}</p>
                        {weatherData?.list?.[38]?.weather?.[0]?.description}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )};
export default WeatherApp