import React from 'react';
import styled from 'styled-components';
import rightArrow from '../../assets/icons/right-arrow.svg';

function Pagination({ lastPage, page, setPage }) {
  return (
    <Nav>
      <Button onClick={() => setPage(page - 1)} disabled={page === 0}>
        <img src={rightArrow} alt="left-arrow" style={{ transform: 'rotate(180deg)' }} />
      </Button>
      {Array(lastPage)
        .fill()
        .map((_, i) => (
          <Button
            key={String(i + 1)}
            onClick={() => setPage(i)}
            aria-current={page === i ? 'page' : null}
          >
            {i + 1}
          </Button>
        ))}
      <Button onClick={() => setPage(page + 1)} disabled={page + 1 === lastPage}>
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
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 0;
  align-items: center;
  font-size: 1rem;
  color: #746b5f;

  &:hover:not([disabled]):not([aria-current]) {
    background-color: rgba(116, 107, 95, 0.1);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: revert;
    transform: revert;
  }

  &[aria-current] {
    background-color: #746b5f;
    color: #fff;
    cursor: revert;
    transform: revert;
  }

  img {
    width: 8px;
  }
`;

export default Pagination;
