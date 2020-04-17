import handleErrors from './handleErrors';

const putRequest = async (url: string, body: any, token?: string) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const request = new Request(url, {
        body: JSON.stringify(body),
        headers,
        method: 'PUT',
        mode: 'cors'
    });

    const response = await fetch(request);
    await handleErrors(response);
}

export default putRequest;
