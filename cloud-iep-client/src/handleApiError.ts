import type { Api } from './types/Api';
import ApiStatus from './types/ApiStatus';

const handleApiError = <T>(err: unknown): Api<T> => {
  let error = new Error('Unknown error');
  if (err instanceof Error) {
    error = err;
  }

  return { status: ApiStatus.Error, error };
};

export default handleApiError;
