import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GithubLogin.scss';
import { BASE_URL } from '../../config';

function GithubLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const GITHUB_CODE: string = location.search.split('=')[1];

  useEffect(() => {
    axios
      .post(`${BASE_URL}/auth/sign-in`, { code: GITHUB_CODE })
      .then(res => {
        if (res.data.isMember) {
          localStorage.setItem('token', res.data.accessToken);
          navigate('/');
        } else {
          navigate('/signup');
          localStorage.setItem('githubId', res.data.githubId);
          localStorage.setItem('userName', res.data.userName);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const completionWord: string = '로그인 중입니다...';
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setLoginStatus(prevStatusValue => {
        let result = prevStatusValue
          ? prevStatusValue + completionWord[count]
          : completionWord[0];
        setCount(count + 1);
        if (count >= completionWord.length) {
          setCount(0);
          setLoginStatus('');
        }
        return result;
      });
    }, 200);
    return () => {
      clearInterval(typingInterval);
    };
  });

  return (
    <div className="wrapper">
      <div className="wrapGithubLogin">{loginStatus}</div>
    </div>
  );
}

export default GithubLogin;
