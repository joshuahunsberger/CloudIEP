import { useEffect, useState } from 'react';
import getRequest from '../network/getRequest';
import { useAuth0 } from '../react-auth0-spa';
import { Api } from '../types/Api';
import ApiStatus from '../types/ApiStatus';
import { Student } from './Student';

const useStudentByUrl = (url: string) => {
  const [result, setResult] = useState<Api<Student>>({
    status: ApiStatus.Loading,
  });
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchStudent(url: string) {
      try {
        const token = await getTokenSilently();
        const response = await getRequest<Student>(url, token);

        const student = {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          dateOfBirth: new Date(response.dateOfBirth),
          goals: response.goals,
        } as Student;
        setResult({ status: ApiStatus.Loaded, result: student });
      } catch (error) {
        setResult({ status: ApiStatus.Error, error });
      }
    }

    if (url) {
      setResult({ status: ApiStatus.Loading });

      fetchStudent(url);
    }
  }, [getTokenSilently, url]);

  return result;
};

export default useStudentByUrl;
