import { useEffect, useState } from 'react';
import postRequest from '../network/postRequest';
import { useAuth0 } from '@auth0/auth0-react';
import { Api } from '../types/Api';
import ApiStatus from '../types/ApiStatus';
import { User } from './User';

const useUsersApi = () => {
  const [result, setResult] = useState<Api<User>>({
    status: ApiStatus.Loading,
  });

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function createUser() {
      try {
        const token = await getAccessTokenSilently();

        const response = await postRequest<User>(
          'http://localhost:5000/api/User',
          null,
          token,
        );
        setResult({ status: ApiStatus.Loaded, result: response });
      } catch (error) {
        setResult({ status: ApiStatus.Error, error });
      }
    }
    createUser();
  }, [getAccessTokenSilently]);

  return result;
};

export default useUsersApi;
