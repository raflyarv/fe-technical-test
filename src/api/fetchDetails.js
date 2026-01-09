const BASE_URL = "https://kitsu.io/api/edge/anime";

export const fetchDetails = async ({ id, signal }) => {
  const getUrl = `${BASE_URL}/${id}`;

  const response = await fetch(getUrl, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch anime details");
  }

  return response.json();
};
