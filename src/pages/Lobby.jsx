import { useNavigate, useParams } from "react-router-dom";
import { players } from "../mock/player";
import PlayerCard from "../components/PlayerCard";
import { io } from "socket.io-client";
import { useTriviaStore } from "../store/store";
import { useEffect } from "react";
import {deletePlayer} from '../services/api';

const Lobby = () => {
  const { roomPlayers, setRoomPlayers, player } = useTriviaStore(state => state)
  const { roomCode } = useParams()
  
  const navigate = useNavigate()

  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
      socket.on('PlayerHasJoined', (data) => {
        console.log(data)
        setRoomPlayers(data)
      })

      socket.on('player-list', (data) => {
        console.log(data)
        setRoomPlayers(data)
      })
    });

  }, [])

  useEffect(() => {
  
  
  }, [])
  
  const handleLeave = async() =>{
    deletePlayer({nickname: player.nickname, roomId: roomCode})
    navigate('/welcome')
    try {
      await deletePlayer({ nickname: player.nickname, roomId: roomCode });
      navigate('/welcome');
    } catch (err) {
      console.error("Network/server error:", err);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col gap-5 justify-center items-center">
      <div className="text-center">
        <h1 className="text-xl">Código de sala</h1>
        <p className="text-3xl">{roomCode}</p>
      </div>
      <div>
        {roomPlayers.map(player => <PlayerCard key={player.nickname} player={player} />)}
      </div>
      <div className="max-w-xs sm:max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-5">
        {
          players.map(player => <PlayerCard key={player.nickname} player={player} />)
        }
      </div>
      <button onClick={handleLeave} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        Salir de sala
      </button>

      <button onClick={()=> {console.log(player)}} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        get player
      </button>

    </div>
  );
};

export default Lobby;