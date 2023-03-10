import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NOTACHIEVE } from '../../helper/constants';

function MyBadge({ badges, fetchBadge }) {
  const [totalBadges, setTotalBadges] = useState(NOTACHIEVE);

  const getImagePath = (code) => {
    return `${process.env.REACT_APP_IMG_URL}/${code}.svg`;
  };

  const changeGetBadge = (category, badges) => {
    if (badges) {
      return NOTACHIEVE[category].map((notAchieve) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < badges.length; i++) {
          if (notAchieve.includes(badges[i])) return badges[i];
        }
        return notAchieve;
      });
    }
    return NOTACHIEVE[category];
  };

  useEffect(() => {
    if (Object.keys(badges).length !== 0) {
      fetchBadge();
    }
  }, []);

  useEffect(() => {
    const { visit, trial, playtime } = badges;
    const visitBadge = changeGetBadge('visit', visit);
    const trialBadge = changeGetBadge('trial', trial);
    const playtimeBadge = changeGetBadge('playtime', playtime);
    setTotalBadges({ visit: visitBadge, trial: trialBadge, playtime: playtimeBadge });
  }, [badges]);

  return (
    <BadgeWrapper>
      <Category>
        <Typography>접속횟수</Typography>
        <BadgeList>
          {totalBadges.visit?.map((code) => (
            <Badge key={code} src={getImagePath(code)} alt={code} />
          ))}
        </BadgeList>
      </Category>
      <Category>
        <Typography>플레이횟수</Typography>
        <BadgeList>
          {totalBadges.trial?.map((code) => (
            <Badge key={code} src={getImagePath(code)} alt={code} />
          ))}
        </BadgeList>
      </Category>
      <Category>
        <Typography>플레이타임</Typography>
        <BadgeList>
          {totalBadges.playtime?.map((code) => (
            <Badge key={code} src={getImagePath(code)} alt={code} />
          ))}
        </BadgeList>
      </Category>
    </BadgeWrapper>
  );
}

const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Typography = styled.h2`
  font-family: 'TTTogether';
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.DIM_GRAY};
  margin-right: 20px;
`;

const Category = styled.div`
  display: flex;
  width: 75%;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const BadgeList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Badge = styled.img`
  width: 150px;
  height: 150px;
`;

export default MyBadge;
