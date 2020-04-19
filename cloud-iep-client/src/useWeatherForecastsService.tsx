import { useEffect, useState } from 'react';
import { WeatherForecast } from './WeatherForecast';
import { Api } from './types/Api';
import getRequest from './network/getRequest';
import ApiStatus from './types/ApiStatus';

const useWeatherForecastsService = () => {
  const [result, setResult] = useState<Api<WeatherForecast[]>>({
    status: ApiStatus.Loading,
  });

  useEffect(() => {
    getRequest<WeatherForecast[]>('http://localhost:5000/weatherforecast')
      .then((response) =>
        setResult({ status: ApiStatus.Loaded, result: response }),
      )
      .catch((error) => setResult({ status: ApiStatus.Error, error }));
  }, []);

  return result;
};

export default useWeatherForecastsService;
