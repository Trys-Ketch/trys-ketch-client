import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import background from '../../assets/images/background.svg';
import ModalContainer from '../modal/ModalContainer';
import RouteChangeTracker from '../../ga/RouteChangeTraker';

function Layout() {
  RouteChangeTracker();

  return (
    <StLayout>
      <ModalContainer />
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
