import handleErrors from './handleErrors';

async function getRequest<T>(url: string): Promise<T> {
    const request = new Request(url, {
        mode: 'cors'
    });

    return fetch(request)
        .then(handleErrors)
        .then(response => response.json());
}

export default getRequest;
