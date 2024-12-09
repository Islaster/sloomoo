/**
 * Sends a prompt read from a local file to a specified API URL.
 *
 * @param {string} filePath - The relative path to the prompt JSON file.
 * @param {string} apiUrl - The API endpoint to send the prompt to.
 * @returns {Promise<void>} - Resolves if the operation is successful, otherwise throws an error.
 */
export async function sendPromptToComfy(filePath, apiUrl) {
    try {
        console.log('filepath: ', filePath)
      // Fetch the prompt file
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
  
      // Parse the JSON file
      const prompt = await response.json();
  
      // Send the prompt to the API
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      // Check the API response
      if (apiResponse.ok) {
        console.log("Prompt sent successfully!");
      } else {
        throw new Error(`Failed to send prompt: ${apiResponse.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error.message);
      throw error; // Re-throw the error for further handling if needed
    }
  }
  