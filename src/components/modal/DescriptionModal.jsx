import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';

function DescriptionModal() {
  const { closeModal } = useModal();
  return (
    <Modal width="580px" title="공지사항" btnText="확인" onConfirm={closeModal}>
      <DescriptionText>아직은 미완성이라서, 다음 사항들은 양해 부탁드려요&#x1F625;</DescriptionText>
      <BoldText>음성채팅이 원활하지 않을 경우 해결 방법</BoldText>
      <DescriptionText>
        {`1. 브라우저의 마이크 접근 권한을 허가해주세요
2. 허가하지 않으면 다른 유저들이 플레이어님의 말을 들을 수 없어요!`}
      </DescriptionText>
      <BoldText>제한시간 관련</BoldText>
      <DescriptionText>
        {`현재 제한시간이 적용되어 있지 않아요
그래서 플레이어 전원이 제출을 해야 다음 라운드로 넘어갈 수 있어요

플레이에 문제가 되지 않게 빠른 시일내에 조치하도록 하겠습니다.
많은 관심 부탁드려요! 감사합니다.`}
        &#x1F60D;
      </DescriptionText>
    </Modal>
  );
}

const DescriptionText = styled.div`
  white-space: pre-wrap;
  width: 100%;
  font-size: 18px;
  line-height: 1.5rem;
`;

const BoldText = styled.div`
  white-space: pre-wrap;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5rem;
`;

export default DescriptionModal;
