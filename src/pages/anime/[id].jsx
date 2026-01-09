import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDetails } from "../../api/fetchDetails";

const DetailPage = () => {
  const { id } = useParams();

  const [anime, setAnime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);
    setError(null);

    async function loadDetails() {
      try {
        const data = await fetchDetails({ id, signal });
        setAnime(data.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
    return () => {
      controller.abort();
    };
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <p>
        Title: {anime?.attributes.titles.en || anime?.attributes.titles.en_jp}
      </p>
      <p> Synopsis: {anime?.attributes.synopsis} </p>
      <p> Status: {anime?.attributes.status} </p>
      <p> Episode Count: {anime?.attributes.episodeCount} </p>
    </div>
  );
};

export default DetailPage;
