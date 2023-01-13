import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  min-width: 1180px;
  min-height: 620px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #d1e5af;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  border-bottom: 15px solid #6fab81;
`;

export default Container;
