import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import background from '../../assets/images/background.svg';

function Layout() {
  console.log(background);
  return (
    <StLayout>
      <Outlet />
    </StLayout>
  );
}

const StLayout = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
`;

export default Layout;
