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
  
  const fetchCoordinatesData = async (location: string, apiKey: string): Promise<CoordinatesData> => {
    const apiCoorUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`;
  
    try {
      const response = await fetch(apiCoorUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch coordinate data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching city coordinate data:', error);
      throw error;
    }
  };
  
  const fetchWeatherData = async (lat: number, lon: number, apiKey: string): Promise<WeatherData> => {
    const weatherAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  
    try {
      const response = await fetch(weatherAPIURL);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching city weather data:', error);
      throw error;
    }
  };
  
  export { fetchCoordinatesData, fetchWeatherData };
  