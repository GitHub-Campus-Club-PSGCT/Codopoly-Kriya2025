import React, { useState,useEffect } from "react";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { socketAPI } from "../api/API";

const Leaderboards = () => {
    const [teamData, setTeamData] = useState([]);
    useEffect(()=>{
        socketAPI.connect();
        socketAPI.leaderBoard((data)=>{
          setTeamData(data);
        })
    },[]);

    return (
        <div>
          <ToastContainer />
          <table>
            <thead>
              <tr>
                <th>Place</th>
                <th>Team Name</th>
                <th>Gitcoins</th>
              </tr>
            </thead>
            <tbody>
              {teamData.map((team) => (
                <tr key={team.place}>
                  <td>{team.place}</td>
                  <td>{team.team_name}</td>
                  <td>{team.gitcoins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
export default Leaderboards;