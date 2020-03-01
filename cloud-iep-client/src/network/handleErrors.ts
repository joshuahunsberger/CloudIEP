async function handleErrors(response: Response) {
    if (!response.ok) {
        const errorText = await response.text();
        console.log("Error processing request: " + errorText);
        throw new Error("There was an error processing your request.");
    }

    return response;
}

export default handleErrors;
