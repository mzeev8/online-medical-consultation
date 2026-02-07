import axios from "axios";

/**
 * Makes an authenticated request using the provided auth token.
 * @param {string} url - The endpoint URL to make the request to.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data] - The request payload (for POST, PUT, etc.).
 * @param {string} authToken - The authentication token to include in the request headers.
 * @returns {Promise} - A promise that resolves to the response of the request.
 */
export async function fetchWithAuth(url, method, data = null, authToken) {
    try {
        // console.log(authToken);

        const response = await axios({
            url,
            method,
            data,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error making authenticated request:", error);
        throw error;
    }
}
