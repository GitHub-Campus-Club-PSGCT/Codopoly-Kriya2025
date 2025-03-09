import React, { useState,useEffect } from "react";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';


const Leaderboards = () => {
    const [teamData, setTeamData] = useState([]);
    const [socket,setSocket]=useState(null);
    useEffect(()=>{
        const socket = io('http://localhost:3000');
        setSocket(socket);

        socket.on('leaderboard',(teamArray)=>{
            console.log(teamArray)
            setTeamData(teamArray);
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