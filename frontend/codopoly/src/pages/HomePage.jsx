import React from 'react';
import { Code2, Users, Clock, Trophy, ChevronRight } from 'lucide-react';
import styles from '../styles/home.module.css';
import {useNavigate} from 'react-router-dom';
import Logo from '../assets/Logo.png';


const HomePage = ()=>{

  const navigate = useNavigate();

  const handleClick = ()=>{
    navigate('/register');
  }

  return (
    <div className={styles.minheight}>
      {/* Hero Section */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headercontent}`}>
          <img style={{"height":"100px"}} src={Logo} alt ="" />
          <p className={styles.subtitle}>
            A unique coding competition where debugging meets strategy
          </p>
          <button className={styles.button} onClick={handleClick}>
            Register Your Team<ChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* Event Description */}
      <section className={`${styles.section} ${styles.sectionsecondary}`}>
        <div className={`${styles.container} ${styles.sectiongrid}`}>
          <div className={styles.fadein}>
            <h2 className={styles.gradienttext} style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              How It Works
            </h2>
            <p style={{ color: '#d1d1d1', lineHeight: '1.75' }}>
            Codopoly is an exhilarating coding event consisting of multiple rounds, where teams start by decoding and fixing their main code segment. Additionally, each team receives two external code segments belonging to other teams, which they must debug and submit to the auction. Participants take on rotating roles as buyers and sellers, encouraging collaboration and adaptability. Strategic elements, such as action cards like Time Boost or Bug Hint, add an extra layer of excitement, making sharp debugging skills and tactical thinking essential for success.
            </p>
          </div>
          <div className={styles.featuresgrid}>
            <div className={`${styles.featurecard} ${styles.fadeindelay1}`}>
              <Code2 className={styles.featureicon} size={32} />
              <h3 className={styles.featuretitle}>Debug</h3>
              <p className={styles.featuretext}>Fix bugs in your code pieces</p>
            </div>
            <div className={`${styles.featurecard} ${styles.fadeindelay1}`}>
              <Users className={styles.featureicon} size={32} />
              <h3 className={styles.featuretitle}>Trade</h3>
              <p className={styles.featuretext}>Exchange code with other teams</p>
            </div>
            <div className={`${styles.featurecard} ${styles.fadeindelay2}`}>
              <Clock className={styles.featureicon} size={32} />
              <h3 className={styles.featuretitle}>Time</h3>
              <p className={styles.featuretext}>Race against the clock</p>
            </div>
            <div className={`${styles.featurecard} ${styles.fadeindelay2}`}>
              <Trophy className={styles.featureicon} size={32} />
              <h3 className={styles.featuretitle}>Win</h3>
              <p className={styles.featuretext}>Score points and compete</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rounds Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.gradienttext} style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center' }}>
            Game Rounds
          </h2>
          <div className={styles.sectiongrid}>
            <div className={`${styles.roundcard} ${styles.fadein}`}>
              <h3 className={styles.roundtitle}>Round 1: Debug</h3>
              <ul className={styles.roundlist}>
                <li>15-20 minutes per debug round</li>
                <li>Teams receive buggy code to fix</li>
                <li>Roles: buyer/seller and debugger(s)</li>
                <li>Fix bugs in main program and tradeable code parts</li>
              </ul>
            </div>
            <div className={`${styles.roundcard} ${styles.fadeindelay1}`}>
              <h3 className={styles.roundtitle}>Round 2: Trade</h3>
              <ul className={styles.roundlist}>
                <li>5-7 minutes per trade round</li>
                <li>Trade fixed code parts for points</li>
                <li>3-5 trades allowed per team</li>
                <li>Points based on bug difficulty</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2024 Codopoly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;