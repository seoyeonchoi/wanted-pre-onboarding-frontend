import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [termsAccepted, setTermsAccepted] = useState(false);

  const isFormValid = email.includes('@') && password.length >= 8;
  
  let navigate = useNavigate();
    // 페이지가 로드될 때 실행되는 useEffect
    useEffect(() => {
        // 토큰이 로컬 스토리지에 있는 경우 TODO 페이지로 리디렉션
        if (localStorage.getItem('token')) {
            navigate('/todo');
        } else {
            // 토큰이 로컬 스토리지에 없는 경우 로그인 페이지로 리디렉션
            navigate('/signup');
        }
        }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  const isEmailValid = (email) => {
    // 여기에 이메일 유효성 검사 로직을 추가하세요.
    return email.includes('@');
  };
  
  const isPasswordValid = (password) => {
    // 여기에 비밀번호 유효성 검사 로직을 추가하세요.
    return password.length >= 8;
  };
  
//   const arePasswordsMatching = () => {
//     return password === confirmPassword;
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
        alert('비밀번호는 8자 이상 입력해주세요.');
        return;
    }
    // 여기에 회원가입 로직을 추가하세요.
    try {
        const response = await axios.post('https://www.pre-onboarding-selection-task.shop/auth/signup', {
          email,
          password,
        },{
            headers: {
              'Content-Type': 'application/json',
              // 여기에 필요한 추가적인 헤더들을 추가하세요.
            },
        });
    
        if (response.status === 201) { // 성공적으로 회원가입 완료
            console.log('Signup successful');
            navigate('/signin');
        } else { // 서버에서 오류 메시지 반환
            console.log(`Unexpected status code: ${response.status}`);
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
          <h1>TodoList Signup</h1>
        <div>
          <div>
            <h2>Create and account</h2>
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <label htmlFor='email'>Your email</label>
              <input type="email" name="email" id="email" data-testid="email-input" 
              placeholder="name@email.com" 
              required 
              onChange={(e) => setEmail(e.target.value)} />

              {/* Password input */}
              <label htmlFor='password'>Password</label>
              <input type="password" name="password" id="password" placeholder="••••••••" 
              data-testid="password-input" 
              required 
              onChange={(e) => setPassword(e.target.value)} />

               {/* Submit button */}
               <button 
                    type="submit"
                    data-testid="signup-button" disabled={!isFormValid}
                    >
                    Create an account
                </button>
               <p>
                    Already have an account? <a href="/signin">Login here</a>
                </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;