import Register from '../components/Register.jsx'
import styles from '../styles/register.module.css'
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import jwtDecode from 'jwt-decode'; 

const RegisterPage = ()=>{


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

  return(
    <>
      <div className={styles.maincontainer}>
        <Register/>
      </div>
    </>
  )
}

export default RegisterPage