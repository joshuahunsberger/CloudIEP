import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import handleApiError from '../handleApiError';
import getRequest from '../network/getRequest';
import type { Api } from '../types/Api';
import ApiStatus from '../types/ApiStatus';
import type { Goal } from './Goal';
import type { Observation } from "./Observation";
import { sortObservationsByDate } from './observationSort';

const useGoalByUrl = (url: string) => {
  const [result, setResult] = useState<Api<Goal>>({
    status: ApiStatus.Loading,
  });
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchGoal(url: string) {
      try {
        const token = await getAccessTokenSilently();
        const response = await getRequest<Goal>(url, token);

        const goal = {
          ...response,
          beginDate: new Date(response.beginDate),
          endDate: new Date(response.endDate),
          observations: response.observations
            .map(
              (obs) =>
                ({
                  ...obs,
                  observationDate: new Date(obs.observationDate),
                } as Observation),
            )
            .sort(sortObservationsByDate),
        } as Goal;
        setResult({ status: ApiStatus.Loaded, result: goal });
      } catch (error) {
        setResult(handleApiError<Goal>(error));
      }
    }

    if (url) {
      setResult({ status: ApiStatus.Loading });

      fetchGoal(url);
    }
  }, [getAccessTokenSilently, url]);

  return result;
};

export default useGoalByUrl;
