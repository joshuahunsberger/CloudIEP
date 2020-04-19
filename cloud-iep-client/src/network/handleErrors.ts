async function handleErrors(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    const errorText = await response.text();
    console.log("Error processing request: " + errorText);
    throw new Error(errorText);
  }

  return response;
}

export default handleErrors;
