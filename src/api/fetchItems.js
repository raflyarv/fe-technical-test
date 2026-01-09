const BASE_URL = "https://kitsu.io/api/edge/anime";

export const fetchItems = async ({ limit, offset, signal }) => {
  const getUrl = `${BASE_URL}?page[limit]=${limit}&page[offset]=${offset}`;

  const response = await fetch(getUrl, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  console.log("Fetch Items Response:", response);

  return response.json();
};
