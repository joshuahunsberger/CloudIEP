import handleErrors from "./handleErrors";

async function postRequest<T>(
  url: string,
  body: any,
  token?: string,
): Promise<T> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const request = new Request(url, {
    body: JSON.stringify(body),
    headers,
    method: "POST",
    mode: "cors",
  });

  return fetch(request)
    .then((request) => handleErrors(request))
    .then((response) => response.json());
}

export default postRequest;
