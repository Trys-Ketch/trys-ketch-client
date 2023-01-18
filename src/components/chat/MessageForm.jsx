import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../common/TextInput';
import FlatButton from '../common/FlatButton';

function MessageForm() {
  const [message, setMessage] = useState('');

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 메시지 전송
    setMessage('');
  };

  return (
    <StMessageForm>
      <TextInput placeholder="채팅을 입력하세요" value={message} onChange={handleInput} />
      <FlatButton size="small" onClick={handleSubmit}>
        전송
      </FlatButton>
    </StMessageForm>
  );
}

const StMessageForm = styled.form`
  display: flex;
  flex-direction: row;
  margin-top: 10px;

  input {
    margin-right: 10px;
  }
`;

export default MessageForm;
