import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import handleApiError from '../handleApiError';
import postRequest from '../network/postRequest';
import type { Api } from '../types/Api';
import ApiStatus from '../types/ApiStatus';
import type { User } from './User';

const useUsersApi = () => {
  const [result, setResult] = useState<Api<User>>({
    status: ApiStatus.Loading,
  });

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function createUser() {
      try {
        const token = await getAccessTokenSilently();

        const response = await postRequest<null, User>(
          'http://localhost:5000/api/User',
          null,
          token,
        );
        setResult({ status: ApiStatus.Loaded, result: response });
      } catch (err) {
        const result = handleApiError<User>(err);
        setResult(result);
      }
    }
    createUser();
  }, [getAccessTokenSilently]);

  return result;
};

export default useUsersApi;
