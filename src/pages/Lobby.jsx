import { useNavigate, useParams } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import { io } from "socket.io-client";
import { useTriviaStore } from "../store/store";
import { useEffect, useRef, useState } from "react";
import {deletePlayer, getRoom, updatePlayer} from '../services/api';

const Lobby = () => {
  const socketRef = useRef()
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:3000')
  }
  const socket = socketRef.current;
  const { roomPlayers, setRoomPlayers, player, setPlayer } = useTriviaStore(state => state)
  const { roomCode } = useParams()
  const [maxPlayers, setMaxPlayers] = useState(null)
  const navigate = useNavigate()
  
  const setup = async () => {
    await setPlayer({...player, isReady: false})
    const resetPlayer = {...player, isReady: false, score: 0}
    await updatePlayer({playerId: player.id, player: resetPlayer})

    const roomData = await getRoom(roomCode)
    const maxPlayers = roomData[0].maxPlayers
    console.log("max players: ", maxPlayers)
    setMaxPlayers(maxPlayers)
  }

  useEffect(() => {
    setup()

    socket.on('connect', () => {
      console.log('connected')

      socket.on('playerHasJoined', (data) => {
        setRoomPlayers(data)
      })

      socket.on('playerHasLeft', (data) => {
        setRoomPlayers(data)
      })

      socket.on('allPlayersReady', async () => {
        console.log("all players are ready")
        navigate(`/questions/${roomCode}`)
        await handleNotReady()
      })

      socket.emit('playerJoins', roomCode)
      
    });

  return () => {
    socket.off('connect')
    socket.off('playerHasJoined')
    socket.off('playerHasLeft')
    socket.off('allPlayersReady')
  }

  }, [roomCode])

  useEffect(() => {
    console.log("Updated room players: ", roomPlayers)
  }, [roomPlayers])
  
  const handleLeave = async() =>{
     socket.emit("playerLeaves", {roomId: roomCode, playerId: player.id, nickname: player.nickname})
     navigate("/welcome")
    // deletePlayer({nickname: player.nickname, roomId: roomCode})
    // navigate('/welcome')
    // try {
    //   await deletePlayer({ nickname: player.nickname, roomId: roomCode });
    //   navigate('/welcome');
    // } catch (err) {
    //   console.error("Network/server error:", err);
    // }
  }

  const handleNext = async() => {
    console.log('redirecting...')
    await setPlayer({...player, roomId: roomCode})
    navigate(`/questions/${roomCode}`)
  }

  const handleReady = async () =>{
    console.log('player is ready')
    await setPlayer({...player, isReady: true})
    socket.emit('playerIsReady', {roomId: roomCode, playerId:  player.id})
  }

  const handleNotReady = async () =>{
    console.log('player is not ready')
    await setPlayer({...player, isReady: false})
    socket.emit('playerNotReady', {roomId: roomCode, playerId:  player.id})
  }

  return (
    <div className="w-full h-screen flex flex-col gap-5 sm:gap-10 justify-center items-center">
      <div className="w-full sm:w-sm">
        <h1 className="text-xl text-center">Código de sala</h1>
        <p className="text-3xl text-center">{roomCode}</p>
        <p className="text-md">jugadores en sala: {roomPlayers.length}/{maxPlayers}</p>
      </div>
      <div className="max-w-xs sm:max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-5">
        { roomPlayers.length > 0 && roomPlayers.map(player => <PlayerCard key={player.nickname} player={player} />)}
      </div>

      <div className="flex flex-col gap-2 ">
        <button onClick={()=>{
          if(player.isReady){
            handleNotReady()
          }else{
            handleReady()
          }
        }} className={`border-2 border-amber-900 px-8 py-2 text-lg text-white ${player.isReady ? "bg-emerald-500 active:bg-emerald-700 active:border-emerald-800" : "bg-red-500 active:bg-red-700 active:border-red-800"}   rounded`}>
          Listo
        </button>
        <button onClick={handleLeave} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
          Salir de sala
        </button>
      </div>

      {/* <button onClick={()=> {console.log(player)}} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        get player
      </button> */}
      {/* <button onClick={handleNext} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-red-500 active:bg-red-700 active:border-red-800 rounded">
        next
      </button> */}
    </div>
  );
};

export default Lobby;