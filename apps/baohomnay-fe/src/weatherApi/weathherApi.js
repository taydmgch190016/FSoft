import axios from 'axios';

export const getCurrentCity = async () => {
    try {
        const getPosition = () => {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        };

        const position = await getPosition();
        const { latitude, longitude } = position.coords;

        const apiKey = "03954bcb3a9d4168b1d541b9d803b339"; 
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en`;

        const response = await axios.get(url);
        const data = response.data;
        const city = data.results[0].components.city;
        return city;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const getWeather = async ({city}) => {
  const weather = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9f1fb3c8e50f981421c1beb97b02eebf`
  );
  return weather;
};
