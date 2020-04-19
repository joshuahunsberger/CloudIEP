import React from "react";
import useWeatherForecastsService from "./useWeatherForecastsService";
import ApiStatus from "./types/ApiStatus";

const WeatherForecasts: React.FC<{}> = () => {
  const service = useWeatherForecastsService();

  return (
    <div>
      {service.status === ApiStatus.Loading && <div>Loading...</div>}
      {service.status === ApiStatus.Loaded &&
        service.result.map((forecast) => (
          <div key={forecast.date.valueOf()}>
            <b>Date:</b> {forecast.date}
            <br />
            Temp (C): {forecast.temperatureC} Temp (F): {forecast.temperatureF}{" "}
            Summary: {forecast.summary}
          </div>
        ))}
      {service.status === ApiStatus.Error && (
        <div>There was an error with the service.</div>
      )}
    </div>
  );
};

export default WeatherForecasts;
