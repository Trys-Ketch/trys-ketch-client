import styled from 'styled-components';
import background from '../../assets/images/background.svg';

const Layout = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
`;

export default Layout;
