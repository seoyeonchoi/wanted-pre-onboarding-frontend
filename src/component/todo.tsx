import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authcontext'; // adjust path as needed
import axios from 'axios';

interface TodoItem {
  id: number;
  todo: string;
  dueDate: string;
  isCompleted: boolean; // 완료 여부를 나타내는 필드 추가
}

function Todo() {
  const { logout, token } = useAuth(); // Use the logout function from the context
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoText, setEditedTodoText] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰이 로컬 스토리지에 있는 경우 TODO 페이지로 리디렉션
    if (localStorage.getItem('token')) {
        navigate('/todo');
    } else {
        // 토큰이 로컬 스토리지에 없는 경우 로그인 페이지로 리디렉션
        navigate('/signin');
    }
    }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  const handleLogout = async () => {
    try {
      logout(); // 로그아웃 처리
      navigate('/signin'); // 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTodo = async () => {
    try {
      // POST 요청을 보내서 새로운 todo를 추가합니다.
      const response = await axios.post<TodoItem>(
        'https://www.pre-onboarding-selection-task.shop/todos',
        {
          todo: todoText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 추가된 todo를 리스트에 추가합니다.
      setTodos([...todos, response.data]);

      // 입력 필드 초기화
      setTodoText('');
    } catch (error) {
      console.error(error);
    }
  };

  // handleToggleComplete 함수를 아래와 같이 추가하세요.
  const handleToggleComplete = async (todoId: number, isCompleted: boolean) => {
    try {
      // 서버에 해당 할 일의 상태를 업데이트합니다.
      await axios.put<TodoItem>(
        `https://www.pre-onboarding-selection-task.shop/todos/${todoId}`,
        {
          isCompleted: !isCompleted, // 상태를 반전시킵니다.
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // 해당 todo를 찾아와서 텍스트를 얻습니다.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        // 해당 todo를 찾았을 때만 텍스트를 업데이트합니다.
        return { ...todo, isCompleted: !isCompleted };
      }
      return todo;
    });

    // 서버에서 데이터를 업데이트하므로 체크박스의 상태를 서버에서 받은 값으로 설정합니다.
      setTodos(updatedTodos);
  
      // 편집 상태 초기화
      setEditingTodoId(null);
      setEditedTodoText('');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        console.log(error.response.data); // 추가 정보 출력
      }
    }
  };

  const handleEditButtonClick = (todoId: number, todoText: string) => {
    setEditingTodoId(todoId);
    setEditedTodoText(todoText);
  };

  const handleEditTodo = async (todoId: number) => {
    try {
      const response = await axios.put<TodoItem>(
        `https://www.pre-onboarding-selection-task.shop/todos/${todoId}`,
        {
          todo: editedTodoText,
          isCompleted: true, // 필요에 따라 수정
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 수정된 할 일로 목록을 업데이트합니다.
      const updatedTodos = todos.map((todo) =>
        todo.id === todoId ? response.data : todo
      );
      setTodos(updatedTodos);

      // 편집 상태 초기화
      setEditingTodoId(null);
      setEditedTodoText('');
    } catch (error) {
      console.error(error);
    }
  };

  // 취소 버튼 클릭 시
  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditedTodoText('');
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await axios.delete(
        `https://www.pre-onboarding-selection-task.shop/todos/${todoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 삭제된 할 일을 목록에서 제거합니다.
      const updatedTodos = todos.filter((todo) => todo.id !== todoId);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(token)
    // GET 요청을 보내서 현재 사용자의 todos를 가져옵니다.
    const fetchTodos = async () => {
      try {
        const response = await axios.get<TodoItem[]>(
          'https://www.pre-onboarding-selection-task.shop/todos',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTodos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, [token]);

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault(); // 기본 동작 방지
  
      // Enter 키를 눌렀을 때도 "Add" 버튼을 누른 것과 같은 효과를 낼 수 있도록
      // handleAddTodo 함수 호출
      handleAddTodo();
    };

  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
        <div className="flex justify-between items-center px-4 py-2">
          <h1 className="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          로그아웃
        </button>
        </div>
        <br/>
        <form className="w-full max-w-sm mx-auto px-4 py-2"
        onSubmit={handleSubmit} // 폼 제출 핸들러 연결
        >
          <div className="flex items-center border-b-2 border-teal-500 py-2">
            <input
              data-testid="new-todo-input"
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Add a task"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
            />
            <button
              data-testid="new-todo-add-button"
              onClick={handleAddTodo}
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
            >
              Add
            </button>
          </div>
        </form>
        <ul className="divide-y divide-gray-200 px-4">
        {todos.map((todo) => (
            <li key={todo.id} className="py-4">
              <div className="flex items-center">
                <input
                  id={`todo${todo.id}`}
                  name={`todo${todo.id}`}
                  type="checkbox"
                  onChange={() => handleToggleComplete(todo.id, !todo.isCompleted)} // 완료 여부를 변경하는 핸들러 추가
                  // checked={todo.isCompleted} // checkbox의 상태를 할 일의 isCompleted 값과 일치시킵니다.
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                {editingTodoId === todo.id ? (
                  // 편집 중인 경우 입력 필드와 편집 버튼 표시
                  <>
                    <input
                      type="text"
                      value={editedTodoText}
                      onChange={(e) => setEditedTodoText(e.target.value)}
                      className="ml-3 block w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    />
                    <button
                      onClick={() => handleEditTodo(todo.id)}
                      className="bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                    >
                      수정 완료
                    </button>
                    <button
                      onClick={() => handleCancelEdit()}
                      className="ml-2 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  // 편집 중이 아닌 경우 할 일 텍스트와 편집/삭제 버튼 표시
                  <>
                <label htmlFor={`todo${todo.id}`} className="ml-3 block text-gray-900">
                  <span className="text-lg font-medium">{todo.todo}</span>
                  <span className="text-sm font-light text-gray-500">{`Due on ${todo.dueDate}`}</span>
                </label>
                <button
                  data-testid="modify-button"
                  onClick={() => handleEditButtonClick(todo.id, todo.todo)}
                  className="ml-3 text-teal-600 hover:text-teal-700"
                >
                  수정
                </button>
                <button
                  data-testid="delete-button"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="ml-3 text-red-600 hover:text-red-700"
                >
                  삭제
                </button>
                </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Todo;