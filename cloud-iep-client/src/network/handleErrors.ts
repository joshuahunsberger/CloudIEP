async function handleErrors(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    } else if (response.status === 404) {
      throw new Error('Not found.');
    }
    const errorText = await response.text();
    console.log('Error processing request: ' + errorText);
    throw new Error(errorText);
  }

  return response;
}

export default handleErrors;
