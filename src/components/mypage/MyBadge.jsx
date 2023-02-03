import React, { useEffect, useState } from 'react';

function MyBadge({ badges, fetchBadge }) {
  const getImagePath = (code) => {
    return `${process.env.REACT_APP_IMG_URL}/${code}.svg`;
  };

  useEffect(() => {
    if (badges !== {}) {
      fetchBadge();
    }
  }, []);

  return (
    <div>
      <div>
        <p>접속횟수</p>
        {badges.visit?.map((code, _) => (
          <img key={code} src={getImagePath(code)} alt={code} />
        ))}
      </div>
      <div>
        <p>플레이횟수</p>
        {badges.trial?.map((code, _) => (
          <img key={code} src={getImagePath(code)} alt={code} />
        ))}
      </div>
      <div>
        <p>플레이타임</p>
        {badges.playtime?.map((code, _) => (
          <img key={code} src={getImagePath(code)} alt={code} />
        ))}
      </div>
    </div>
  );
}

export default MyBadge;
