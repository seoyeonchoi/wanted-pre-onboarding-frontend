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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          TodoList Signin
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray_800 dark:border_gray_700 p-10">
          <div className="pqke_6 space_y_4 md_space_y_6 sm_p_8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray_900 md:text_2xl dark:text_white">Sign in to your account</h1>
            <form onSubmit={handleSubmit} className='space-y_4 md_space_y_6'>
              {/* Email input */}
              <label htmlFor='email' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required onChange={(e) => setEmail(e.target.value)} />

              {/* Password input */}
              <label htmlFor='password' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={(e) => setPassword(e.target.value)} />

                <button type="submit" data-testid="signin-button" disabled={!isFormValid}
                className="w-full text-black bg-gray-200 border border-none border-gray-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 my-2">Sign in</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet? <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;