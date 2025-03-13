import Register from '../components/Register.jsx'
import styles from '../styles/register.module.css'
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const RegisterPage = ()=>{

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('codopoly_token')){
      navigate('/choosephase');
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