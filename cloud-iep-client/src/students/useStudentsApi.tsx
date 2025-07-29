import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import handleApiError from '../handleApiError';
import getRequest from '../network/getRequest';
import type { Api } from '../types/Api';
import ApiStatus from '../types/ApiStatus';
import type { Student } from './Student';

const useStudentsApi = () => {
  const [result, setResult] = useState<Api<Student[]>>({
    status: ApiStatus.Loading,
  });
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchStudents() {
      try {
        const token = await getAccessTokenSilently();

        const response = await getRequest<Student[]>(
          'http://localhost:5000/api/Student/',
          token,
        );
        const students = response.map(
          (s) =>
            ({
              id: s.id,
              firstName: s.firstName,
              lastName: s.lastName,
              dateOfBirth: new Date(s.dateOfBirth),
            } as Student),
        );
        setResult({ status: ApiStatus.Loaded, result: students });
      } catch (error) {
        setResult(handleApiError<Student[]>(error));
      }
    }
    fetchStudents();
  }, [getAccessTokenSilently]);

  return result;
};

export default useStudentsApi;
