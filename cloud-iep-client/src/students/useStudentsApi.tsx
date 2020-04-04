import { useEffect, useState } from "react";
import getRequest from '../network/getRequest';
import { Api } from '../types/Api';
import ApiStatus from "../types/ApiStatus";
import { Student } from "./Student";

const useStudentsApi = () => {
    const [result, setResult] = useState<Api<Student[]>>({
        status: ApiStatus.Loading
    });

    async function fetchStudents() {
        try {
            const response = await getRequest<Student[]>('http://localhost:5000/api/Student/');
            setResult({ status: ApiStatus.Loaded, result: response });
        }
        catch (error) {
            setResult({ status: ApiStatus.Error, error });
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return result;
}

export default useStudentsApi;
