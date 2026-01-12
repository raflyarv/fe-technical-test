import { useState, useEffect } from "react";
import { fetchItems } from "../api/fetchItems";
import { Link, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { mq } from "../styles/breakpoint";

const FALLBACK_IMAGE_URL = "https://placehold.co/300x400?text=Image+Not+Found";

const ItemCard = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  background: #ffffff;
  border-radius: 14px;
  padding: 14px;
`;

const ListItems = styled.ul`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  padding: 0;
  margin: 0;
  gap: 55px 20px;

  margin-bottom: 50px;
  align-items: stretch;

  ${mq.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mq.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const NonPointedList = styled.li`
  list-style: none;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0px;
  text-align: left;
`;

const clampTwoLines = `
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const EngTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  ${clampTwoLines};
`;

const JpnTitle = styled.h4`
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
  margin: 0;

  ${clampTwoLines};
`;

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 10px;
  background: #e5e7eb;
`;

const ListPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;

  max-width: 1100px;
  margin: auto;
  padding: clamp(16px, 3vw, 32px);
  min-height: 100vh;
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarIcon = styled(FontAwesomeIcon)`
  font-size: 14px;
  color: gold;
  margin-right: 5px;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: #ffff;
`;

const MainInformation = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const StyledH3 = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: #374151;
`;

const StyledH4 = styled.h4`
  font-size: 12px;
  font-weight: normal;
  margin: 0;
  color: #9ca3af;
`;

const SynopsisSection = styled.p`
  text-align: left;
  font-size: 13px;
  line-height: 1.6;
  color: #4b5563;

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: justify-between;
  align-items: center;
  gap-x: 8px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 6px 12px;
  border-radius: 5px;
  background: ${({ active }) => (active ? "#6d6d6dff" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #222;
    color: #fff;
  }
`;

const ListPage = () => {
  const [animes, setAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [totalCount, setTotalCount] = useState(0);

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
        setTotalCount(data.meta.count);
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

  const totalPages = Math.ceil(totalCount / limit);

  const getPageNumbers = (current, total, max = 5) => {
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + max - 1);

    if (end - start < max - 1) {
      start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const reviewTotal = (reviews) => {
    console.log(
      Object.values(reviews).reduce((sum, value) => sum + Number(value), 0)
    );
    return Object.values(reviews).reduce(
      (sum, value) => sum + Number(value),
      0
    );
  };

  return (
    <ListPageContainer>
      <ListItems>
        {animes.map((anime) => (
          <NonPointedList key={anime.id}>
            <StyledLink to={`/anime/${anime.id}`}>
              <ItemCard>
                <Poster
                  src={
                    anime.attributes.posterImage?.small || FALLBACK_IMAGE_URL
                  }
                  alt={anime.attributes.canonicalTitle}
                />

                <MainInformation>
                  <TitleSection>
                    <EngTitle>
                      {anime.attributes.titles.en ||
                        anime.attributes.titles.ja_jp}{" "}
                    </EngTitle>
                    <JpnTitle>{anime.attributes.titles.ja_jp}</JpnTitle>
                  </TitleSection>

                  <RatingSection>
                    <AverageRating>
                      <StarIcon icon={faStar} />
                      <StyledH3>{anime.attributes.averageRating}</StyledH3>
                    </AverageRating>
                    <StyledH4>
                      ({reviewTotal(anime.attributes?.ratingFrequencies) || 0})
                    </StyledH4>
                  </RatingSection>
                </MainInformation>
                <StyledH3>
                  {`${anime.attributes?.startDate?.substring(0, 4)} - ${
                    anime.attributes?.endDate?.substring(0, 4) || "Present"
                  }`}{" "}
                </StyledH3>

                <SynopsisSection>{anime.attributes?.synopsis}</SynopsisSection>
              </ItemCard>
            </StyledLink>
          </NonPointedList>
        ))}
      </ListItems>

      <PaginationContainer>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon icon={faChevronLeft} />
        </button>

        {getPageNumbers(currentPage, totalPages).map((pageNumber) => (
          <PageButton
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            active={pageNumber === currentPage}
          >
            {pageNumber}
          </PageButton>
        ))}

        <button onClick={() => goToPage(currentPage + 1)}>
          {" "}
          <Icon icon={faChevronRight} />
        </button>
      </PaginationContainer>
    </ListPageContainer>
  );
};

export default ListPage;
