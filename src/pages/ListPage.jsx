import { useState, useEffect } from "react";
import { fetchItems } from "../api/fetchItems";
import { Link, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";

const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ffff;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  padding: 10px 15px;
  max-width: 300px;
  justify-content: center;
`;

const NonPointedList = styled.ul`
  list-style: none;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0px;
  text-align: left;
`;

const EngTitle = styled.h3`
  font-size: 16px;
  margin: 0px;
  padding: 0px;
  font-weight: semi-bold;
  color: #353535ff;
`;

const JpnTitle = styled.h4`
  font-size: 14px;
  margin: 0px;
  padding: 0px;
  font-weight: normal;
  color: #605f5fff;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  background-color: #f3f4f6;
`;

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

  console.log(animes[1]?.attributes.coverImage.small);

  return (
    <>
      <ul>
        {animes.map((anime) => (
          <NonPointedList key={anime.id}>
            <Link to={`/anime/${anime.id}`}>
              <ItemCard>
                {/* Butuh diatur untuk bisa muncul/error boundaries */}
                {/* Error: Muncul di 0 aja */}
                <StyledImg
                  src={anime.attributes?.coverImage?.small}
                  alt={anime.attributes?.titles?.en}
                  loading="lazy"
                />
                <TitleSection>
                  <EngTitle>{anime.attributes.titles.en}</EngTitle>
                  <JpnTitle>{anime.attributes.titles.ja_jp}</JpnTitle>
                </TitleSection>
              </ItemCard>
            </Link>
          </NonPointedList>
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
