import { useEffect, useState } from 'react';
import postRequest from '../network/postRequest';
import { useAuth0 } from '../react-auth0-spa';
import { Api } from '../types/Api';
import ApiStatus from '../types/ApiStatus';
import { User } from './User';

const useUsersApi = () => {
  const [result, setResult] = useState<Api<User>>({
    status: ApiStatus.Loading,
  });

  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    async function createUser() {
      try {
        const token = await getTokenSilently();

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
  }, [getTokenSilently]);

  return result;
};

export default useUsersApi;
