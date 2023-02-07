import React from 'react';
import styled from 'styled-components';
import useIntersect from '../../hooks/useIntersect';
import EmptyMyImage from './EmptyMyImage';

function MyImage({ isFetching, hasNextPage, fetchNextImage, images }) {
  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextImage();
    }
  });

  console.log(images);

  if (images.length === 0) {
    return (
      <>
        <EmptyMyImage />
        <Target ref={ref} />
      </>
    );
  }
  return (
    <ImageWrapper>
      {images?.map((img) => (
        <Canvas key={img.imgId}>
          <img src={img.imgPath} alt={img.imgId} loading="lazy" />
        </Canvas>
      ))}
      <Target ref={ref} />
    </ImageWrapper>
  );
}

const Target = styled.div`
  height: 1px;
`;

const ImageWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto-fill, minmax(156px, 156px));
  gap: 20px;
  width: 100%;
  height: 100%;
  padding-right: 15px;
  ${({ theme }) => theme.common.scroll};
`;

const Canvas = styled.div`
  background-color: ${({ theme }) => theme.colors.WHITE};
  box-shadow: 0px 3.5px 3.5px rgba(0, 0, 0, 0.25);

  img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export default MyImage;
