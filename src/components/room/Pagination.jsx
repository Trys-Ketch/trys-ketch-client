import React from 'react';
import styled from 'styled-components';
import rightArrow from '../../assets/icons/right-arrow.svg';

function Pagination({ lastPage, page, setPage }) {
  return (
    <Nav>
      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
        <img src={rightArrow} alt="left-arrow" style={{ transform: 'rotate(180deg)' }} />
      </Button>
      {Array(lastPage)
        .fill()
        .map((_, i) => (
          <Button
            key={String(i + 1)}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? 'page' : null}
          >
            {i + 1}
          </Button>
        ))}
      <Button onClick={() => setPage(page + 1)} disabled={page === lastPage}>
        <img src={rightArrow} alt="right-arrow" />
      </Button>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const Button = styled.button`
  ${({ theme }) => theme.common.flexCenter};
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.DIM_GRAY};

  &:hover:not([disabled]):not([aria-current]) {
    background-color: rgba(116, 107, 95, 0.1);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: revert;
    transform: revert;
  }

  &[aria-current] {
    background-color: ${({ theme }) => theme.colors.DIM_GRAY};
    color: ${({ theme }) => theme.colors.WHITE};
    cursor: revert;
    transform: revert;
  }

  img {
    width: 8px;
  }
`;

export default Pagination;
