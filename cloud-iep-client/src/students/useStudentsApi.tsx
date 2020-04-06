import { useEffect, useState } from "react";
import getRequest from '../network/getRequest';
import { Api } from '../types/Api';
import ApiStatus from "../types/ApiStatus";
import { Student } from "./Student";
import { useAuth0 } from "../react-auth0-spa";

const useStudentsApi = () => {
    const [result, setResult] = useState<Api<Student[]>>({
        status: ApiStatus.Loading
    });
    const { getTokenSilently } = useAuth0();

    useEffect(() => {
        async function fetchStudents() {
            try {
                const options: GetTokenSilentlyOptions = {
                    scope: "openid",
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE ?? ""
                };
                const token = await getTokenSilently(options);

                const response = await getRequest<Student[]>('http://localhost:5000/api/Student/', token);
                setResult({ status: ApiStatus.Loaded, result: response });
            }
            catch (error) {
                setResult({ status: ApiStatus.Error, error });
            }
        }
        fetchStudents();
    }, [getTokenSilently]);

    return result;
}

export default useStudentsApi;
