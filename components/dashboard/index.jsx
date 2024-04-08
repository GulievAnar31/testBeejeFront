import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [email, setEmail] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`https://bejeetest.onrender.com/tasks?page=${currentPage}&limit=3`, {
          headers: {
            Authorization: `${token}`
          }
        });

        setTasks(response.data);
        const totalPagesHeader = response.headers['x-total-pages'];
        setTotalPages(parseInt(totalPagesHeader) || 1);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    fetchTasks();
  }, [currentPage]);

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`https://bejeetest.onrender.com/tasks/${id}`);
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handlePageChange = (type) => {
    setCurrentPage(prevPage => (type === '-' ? prevPage - 1 : prevPage + 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const authToken = localStorage.getItem('token')

      const response = await axios.post(
        'https://bejeetest.onrender.com/tasks',
        {
          email: email,
          description: taskDescription
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      setTasks([...tasks, response.data]);
      setEmail('');
      setTaskDescription('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-form">
        <button onClick={() => {
          localStorage.removeItem('token');
          navigate('/')
        }}>
          Logout
        </button>
        <h2 className="form-title">Add New Task</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Task Description:</label>
            <textarea
              id="description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="form-textarea"
            />
          </div>
          <button type="submit" className="form-button">Add Task</button>
        </form>
      </div>
      <div className="tasks-list">
        <h1 className="tasks-title">All Tasks</h1>
        <ul className="task-list">
          {tasks?.map(task => (
            <li key={task?._id} className="task-item">
              <div>
                <h3 className="task-title">{task?.title}</h3>
                <p className="task-description">Описание: {task ? task.description : 'описание отсутствует'}. Статус: {task?.completed ? "Выполенно" : "Не выполнено"}</p>
              </div>
              <button onClick={() => handleDeleteTask(task._id)} className="delete-task-button">Delete</button>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange('-')}>Previous</button>
          <span className="page-info">{currentPage}</span>
          <button disabled={tasks.length < 3} onClick={() => handlePageChange('+')}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
