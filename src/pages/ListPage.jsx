import { useState, useEffect } from "react";
import { fetchItems } from "../api/fetchItems";
import { Link, useSearchParams } from "react-router-dom";

const ListPage = () => {
  const [animes, setAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Number(searchParams.get("page[limit]") || 10);
  const offset = Number(searchParams.get("page[offset]") || 0);

  const currentPage = Math.floor(offset / limit) + 1;

  const goToPage = (pageNumber) => {
    const newOffset = (pageNumber - 1) * limit;

    setSearchParams(`page[limit]=${limit}&page[offset]=${newOffset}`);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadItems() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchItems({ limit, offset, signal });
        setAnimes(data.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadItems();
    return () => {
      controller.abort();
    };
  }, [limit, offset]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ul>
        {animes.map((anime) => (
          <li key={anime.id}>
            <Link to={`/anime/${anime.id}`}>
              {anime.attributes.titles.en || anime.attributes.titles.en_jp}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {" "}
        Prev{" "}
      </button>

      <button onClick={() => goToPage(currentPage + 1)}> Next </button>
    </>
  );
};

export default ListPage;
