import React, { useState, useEffect } from "react";
import { socketAPI } from "../api/API";
import styles from "../styles/leaderboards.module.css";

const Leaderboards = () => {
    const [teamData, setTeamData] = useState([]);
    useEffect(()=>{
        socketAPI.connect();
        socketAPI.leaderBoard((data)=>{
          setTeamData(data);
        })
    },[]);

    const getRowClass = (place) => {
        if (place === 1) return styles.first;
        if (place === 2) return styles.second;
        if (place === 3) return styles.third;
        return "";
    };

    return (
        <div className={styles.leaderboardContainer}>
          <div className={styles.subcontainer}>
            <h1 className={styles.leaderboardTitle}>{"<Codopoly/> Leaderboard"}</h1>
              <table className={styles.leaderboardTable}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Git Coins</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.map((team, index) => (
                    <tr key={team.place} className={getRowClass(team.place)}>
                      <td>{team.place}</td>
                      <td>{`${team.team_name}`}</td>
                      <td>{team.gitcoins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      );
    };

export default Leaderboards;