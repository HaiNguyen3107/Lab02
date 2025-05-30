/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise}       A promise that resolves to the model data
 */
function fetchModel(url) {
  const baseUrl = "https://lkgky6-8081.csb.app";
  return fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching model:", error);
      console.error("URL attempted:", `${baseUrl}${url}`);
      throw error;
    });
}

export default fetchModel;
