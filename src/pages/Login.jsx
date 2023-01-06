import React from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoLoginBtn from '../components/login/KakaoLoginBtn';
import Button from '../components/common/Button';

function Login() {
  const navigate = useNavigate();
  return (
    <div>
      <KakaoLoginBtn />
      <Button
        onClick={() => {
          navigate('/guest');
        }}
      >
        체험하기
      </Button>
    </div>
  );
}

export default Login;
