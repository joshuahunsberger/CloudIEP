import handleErrors from './handleErrors';

async function deleteRequest(url: string, token?: string): Promise<void> {
  const headers = new Headers();

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const request = new Request(url, {
    mode: 'cors',
    headers: headers,
    method: 'DELETE',
  });

  const response = await fetch(request);
  await handleErrors(response);
}

export default deleteRequest;
