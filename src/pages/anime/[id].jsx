import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDetails } from "../../api/fetchDetails";

import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { mq } from "../../styles/breakpoint";

const FALLBACK_IMAGE_URL = "https://placehold.co/300x400?text=Image+Not+Found";

const PageWrapper = styled.div`
  max-width: 1100px;
  margin: auto;
  padding: clamp(16px, 3vw, 32px);
  min-height: 100vh;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  background: #171a21;
  padding: clamp(16px, 3vw, 24px);
  border-radius: 16px;

  ${mq.tablet} {
    grid-template-columns: 200px 2fr 3fr;
  }
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  ${mq.tablet} {
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: clamp(22px, 4vw, 32px);
  margin: 0;
  color: #f1f5f9;
`;

const SubTitle = styled.h2`
  font-size: 16px;
  font-weight: normal;
  color: #94a3b8;
  margin: 0;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #94a3b8;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #f1f5f9;
`;

const StarIcon = styled(FontAwesomeIcon)`
  color: gold;
`;

const Section = styled.section`
  margin-top: 28px;
  background: #171a21;
  padding: clamp(16px, 3vw, 24px);
  border-radius: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #f1f5f9;
`;

const Synopsis = styled.p`
  text-align: justify;
  line-height: 1.7;
  color: #cbd5e1;
  padding: 0 15px;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;

  ${mq.tablet} {
    justify-content: flex-start;
  }
`;

const InfoItem = styled.div`
  font-size: 14px;
  color: #cbd5e1;
  text-align: center;

  span {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    color: #94a3b8;
  }

  ${mq.tablet} {
    text-align: left;
  }
`;

const BackNav = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: transparent;
  border: none;
  color: #cbd5e1;

  font-size: 16px;
  cursor: pointer;
  padding: 6px 0;
  margin-bottom: 10px;
`;

const BackIcon = styled(FontAwesomeIcon)`
  font-size: 18px;
`;

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const attr = anime?.attributes;

  if (!attr) return <div> Loading... </div>;

  const animeStatus = (status) => {
    if (!status) return "N/A";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <PageWrapper>
      <BackNav onClick={() => navigate(-1)}>
        <BackIcon icon={faArrowLeft} />
        Back
      </BackNav>

      <Header>
        <Poster
          src={attr.posterImage?.medium || FALLBACK_IMAGE_URL}
          alt={attr.canonicalTitle}
        />

        <TitleBlock>
          <Title>{attr.canonicalTitle}</Title>
          <SubTitle>{attr.titles?.ja_jp}</SubTitle>

          <MetaRow>
            <Rating>
              <StarIcon icon={faStar} />
              {Number(attr.averageRating).toFixed(1)}
            </Rating>

            <span>{attr.startDate?.substring(0, 4)}</span>
            <span>{attr.episodeCount || "N/A"} eps</span>
            <span>{attr.showType}</span>
            <span>{attr.ageRating}</span>
          </MetaRow>

          <InfoGrid>
            <InfoItem>
              <span>Status</span>
              {animeStatus(attr.status)}
            </InfoItem>

            <InfoItem>
              <span>Episodes</span>
              {attr.episodeCount || "N/A"}
            </InfoItem>

            <InfoItem>
              <span>Episode Length</span>
              {attr.episodeLength} min
            </InfoItem>

            <InfoItem>
              <span>Popularity Rank</span>#{attr.popularityRank}
            </InfoItem>

            <InfoItem>
              <span>Favorites</span>
              {attr.favoritesCount}
            </InfoItem>
          </InfoGrid>
        </TitleBlock>
      </Header>

      <Section>
        <SectionTitle>Synopsis</SectionTitle>
        <Synopsis>{attr.synopsis || "No synopsis available."}</Synopsis>
      </Section>
    </PageWrapper>
  );
};

export default DetailPage;
