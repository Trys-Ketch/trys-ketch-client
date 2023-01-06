import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../common/Input';
import Button from '../common/Button';

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
      <Input value={message} onChange={handleInput} />
      <Button onClick={handleSubmit}>보내기</Button>
    </StMessageForm>
  );
}

const StMessageForm = styled.form`
  display: flex;
  flex-direction: row;
`;

export default MessageForm;
