import styled from 'styled-components';
import panel from '../../assets/images/panel.svg';

const Panel = styled.div`
  ${({ theme }) => theme.common.absoluteCenter};
  ${({ theme }) => theme.common.flexCenterColumn};
  min-width: 1000px;
  min-height: 600px;
  background-image: url(${panel});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

export default Panel;
