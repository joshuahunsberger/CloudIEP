import ApiStatus from './ApiStatus';

// Concept borrowed from https://github.com/camilosw/react-hooks-services
// and related blog post by Camilo Mejia: https://dev.to/camilomejia/fetch-data-with-react-hooks-and-typescript-390c
interface ApiLoading {
  status: ApiStatus.Loading;
}

interface ApiLoaded<T> {
  status: ApiStatus.Loaded;
  result: T;
}

interface ApiError {
  status: ApiStatus.Error;
  error: Error;
}

export type Api<T> = ApiLoading | ApiLoaded<T> | ApiError;
