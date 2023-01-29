import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import useModal from '../../hooks/useModal';
import { toast } from '../toast/ToastProvider';
import GAEventTrack from '../../ga/GAEventTrack';
import GAEventTypes from '../../ga/GAEventTypes';

function DiscriptionModal() {
  const { closeModal } = useModal();
  return (
    <Modal width="580px" title="공지사항" btnText="확인" onConfirm={closeModal}>
      <DiscriptionText>아직은 미완성이라서, 다음 사항들은 양해 부탁드려요&#x1F625;</DiscriptionText>
      <BoldText>음성채팅이 원활하지 않을 경우 해결 방법</BoldText>
      <DiscriptionText>
        {`1. 방을 나간 다음에 새로고침하고 다시 들어와주세요
2. 그래도 연결이 되지 않으면 현재 창을 닫고 새로운 창으로 접속 부탁드려요`}
      </DiscriptionText>
      <BoldText>제한시간 관련</BoldText>
      <DiscriptionText>
        {`현재 제한시간이 적용되어 있지 않아요
그래서 플레이어 전원이 제출을 해야 다음 라운드로 넘어갈 수 있어요

플레이에 문제가 되지 않게 빠른 시일내에 조치하도록 하겠습니다.
많은 관심 부탁드려요! 감사합니다.`}
        &#x1F60D;
      </DiscriptionText>
    </Modal>
  );
}

const DiscriptionText = styled.div`
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

export default DiscriptionModal;
