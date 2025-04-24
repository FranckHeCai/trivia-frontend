import { useNavigate, useParams } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import { io } from "socket.io-client";
import { useTriviaStore } from "../store/store";
import { useEffect } from "react";
import {deletePlayer} from '../services/api';

const Lobby = () => {
  const { roomPlayers, setRoomPlayers, player, setPlayer } = useTriviaStore(state => state)
  const { roomCode } = useParams()
  
  const navigate = useNavigate()

  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')

      socket.on('fetched-players', (data) => {
        setRoomPlayers(data)
      })

      socket.emit('get-players', roomCode)
      
    });

  }, [])

  useEffect(() => {
    console.log("Updated room players: ", roomPlayers)
  
  }, [roomPlayers])
  
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

  const handleNext = async() => {
    console.log('redirecting...')
    await setPlayer({...player, roomId: roomCode})
    navigate(`/questions/${roomCode}`)
  }

  return (
    <div className="w-full h-screen flex flex-col gap-5 justify-center items-center">
      <div className="text-center">
        <h1 className="text-xl">Código de sala</h1>
        <p className="text-3xl">{roomCode}</p>
      </div>
      <div className="max-w-xs sm:max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-5">
        { roomPlayers.length > 0 && roomPlayers.map(player => <PlayerCard key={player.nickname} player={player} />)}
      </div>
      {/*<div className="max-w-xs sm:max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-5">
        {
          players.map(player => <PlayerCard key={player.nickname} player={player} />)
        }
      </div>*/}
      <button onClick={handleLeave} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        Salir de sala
      </button>

      <button onClick={()=> {console.log(player)}} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        get player
      </button>
      <button onClick={()=> {console.log(roomPlayers)}} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        get room players
      </button>
      <button onClick={handleNext} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        next
      </button>
    </div>
  );
};

export default Lobby;