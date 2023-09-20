import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../authcontext'; // adjust path as needed

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth(); // Use the login function from the context

  const isFormValid = email.includes('@') && password.length >= 8;
  
  let navigate = useNavigate();

  // 페이지가 로드될 때 실행되는 useEffect
  useEffect(() => {
    // 토큰이 로컬 스토리지에 있는 경우 TODO 페이지로 리디렉션
    if (localStorage.getItem('token')) {
      navigate('/todo');
    } else {
      // 토큰이 로컬 스토리지에 없는 경우 로그인 페이지로 리디렉션
      navigate('/signin');
    }
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://www.pre-onboarding-selection-task.shop/auth/signin', {
        email,
        password,
      });
  
      if (response.status === 200) { // 로그인 성공
        console.log('Signin successful');
        console.log(response.data.access_token); // access token 출력
        login(response.data.access_token); // 저장된 token
        navigate('/todo');
        // 필요한 경우 여기서 access token을 저장하거나 다른 동작 수행
  
      } else { // 서버에서 오류 메시지 반환
        console.log(response.data);
      }
      
    } catch (error) { // 네트워크 에러 등 기타 오류 처리
      console.error(error);
      if (error.response && error.response.data) {
        console.log(error.response.data); // 추가 정보 출력
      }
    }
  };

  return (
    <section>
      <div>
          <img src="https://github.com/seoyeonchoi/wanted-pre-onboarding-frontend/blob/main/public/icons8-todo-list-48.png?raw=true" alt="logo" />
          <h1>TodoList Signin</h1>
        <div>
          <div>
            <h2>Sign in to your account</h2>
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <label htmlFor='email'>Your email</label>
              <input type="email" name="email" id="email" placeholder="name@email.com" required onChange={(e) => setEmail(e.target.value)} />

              {/* Password input */}
              <label htmlFor='password'>Password</label>
              <input type="password" name="password" id="password" placeholder="••••••••" required onChange={(e) => setPassword(e.target.value)} />

                <button type="submit" data-testid="signin-button" disabled={!isFormValid}>Sign in</button>
                <p>
                    Don’t have an account yet? <a href="/signup">Sign up</a>
                </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;