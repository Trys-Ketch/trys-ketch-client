import React from 'react';
import styled from 'styled-components';

function Pagination({ lastPage, page, setPage }) {
  return (
    <Nav>
      <Button onClick={() => setPage(page - 1)} disabled={page === 0}>
        &lt;
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
        &gt;
      </Button>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 16px;
`;

const Button = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin: 0;
  background: black;
  color: white;
  font-size: 1rem;

  &:hover {
    background: tomato;
    cursor: pointer;
    transform: translateY(-2px);
  }

  &[disabled] {
    background: grey;
    cursor: revert;
    transform: revert;
  }

  &[aria-current] {
    background: deeppink;
    font-weight: bold;
    cursor: revert;
    transform: revert;
  }
`;

export default Pagination;
