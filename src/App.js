import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./component/signup.tsx";
import SignIn from "./component/signin.tsx";
import Todo from "./component/todo.tsx";
import React from 'react';
import { AuthProvider } from './authcontext'; // adjust path as needed
// import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* 루트 */}
            <Route exact path="/" element={<Todo />}/>
            {/* 투두 */}
            <Route exact path="todo" element={<Todo />}/>
            {/* 회원가입 */}
            <Route exact path="signup" element={<SignUp />}/>
            {/* 로그인 */}
            <Route exact path="signin" element={<SignIn />}/>
          </Routes>
          </AuthProvider>
      </BrowserRouter> 
    </div>
  );
}

export default App;