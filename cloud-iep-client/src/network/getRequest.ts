import handleErrors from "./handleErrors";

async function getRequest<T>(url: string, token?: string): Promise<T> {
  const headers = new Headers();

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const request = new Request(url, {
    mode: "cors",
    headers: headers,
  });

  return fetch(request)
    .then(handleErrors)
    .then((response) => response.json());
}

export default getRequest;
