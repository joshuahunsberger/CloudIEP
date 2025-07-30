import handleErrors from './handleErrors';

async function postRequest<TBody, TResponse>(
  url: string,
  body?: TBody,
  token?: string,
): Promise<TResponse> {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const request = new Request(url, {
    body: JSON.stringify(body),
    headers,
    method: 'POST',
    mode: 'cors',
  });

  return fetch(request)
    .then((request) => handleErrors(request))
    .then(
      (response) =>
        (response.status === 204 ? {} : response.json()) as Promise<TResponse>,
    );
}

export default postRequest;
