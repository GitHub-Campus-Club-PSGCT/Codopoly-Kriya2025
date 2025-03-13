import Login from '../components/Login.jsx';
import styles from '../styles/login.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Make sure to install: npm install jwt-decode

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('codopoly_token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Check if the token is expired
        if (decoded.exp * 1000 > Date.now()) {
          navigate('/choosephase');
        } else {
          localStorage.removeItem('codopoly_token'); // Remove expired token
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('codopoly_token'); // Remove invalid token
      }
    }
  }, []);

  return (
    <>
      <div className={styles.maincontainer}>
        <Login />
      </div>
    </>
  );
};

export default LoginPage;
