import Login from '../components/Login.jsx'
import styles from '../styles/login.module.css'
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const LoginPage = ()=>{

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('codopoly_token')){
      navigate('/choosephase');
    }
  }, []);

  return(
    <>
      <div className={styles.maincontainer}>
        <Login/>
      </div>
    </>
  )
}

export default LoginPage