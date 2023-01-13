import styled from 'styled-components';
import panel from '../../assets/images/panel.svg';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 1000px;
  min-height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url(${panel});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

export default Panel;
