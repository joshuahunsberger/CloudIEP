import { useEffect, useState } from 'react';
import getRequest from '../network/getRequest';
import { useAuth0 } from '@auth0/auth0-react';
import { Api } from '../types/Api';
import ApiStatus from '../types/ApiStatus';
import { Goal, Observation } from './Goal';
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
        setResult({ status: ApiStatus.Error, error });
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
