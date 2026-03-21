import { useEffect, useState } from 'react';
import type { WeatherForecast } from './WeatherForecast';
import getRequest from './network/getRequest';
import type { Api } from './types/Api';
import { ApiStatus } from './types/ApiStatus';

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
