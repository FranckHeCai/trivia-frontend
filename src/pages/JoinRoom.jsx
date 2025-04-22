import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlayer, deletePlayer, getRoom } from "../services/api";
import { useTriviaStore } from "../store/store";

const JoinRoom = () => {
  const { player, setPlayer } = useTriviaStore(state => state)
  const [code, setCode] = useState("")
  const [roomExists, setRoomExists] = useState(false)

  const navigate = useNavigate()
  
  const handleChange = event =>{
    setCode(event.target.value)
    setPlayer({...player, roomId: event.target.value})
    setRoomExists(false)
  }

  const handleSubmit = async(event) => {
    event.preventDefault()
    const roomExists = await getRoom(code)
    if(roomExists.length === 0){
      setRoomExists(true)
    } else {
      setRoomExists(false)
      createPlayer({nickname: player.nickname, avatar: player.avatar, score: player.score, roomId: code})
      navigate(`/lobby/${code}`)
    }
  }

  const handleRoom = async (roomCode) =>{
    const fetchedRoom = await getRoom(roomCode)
    if(fetchedRoom.length === 0){
      setRoomExists(true)
    } else {
      setRoomExists(false)

    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-5 w-full h-screen">
      <h1 className="text-xl sm:text-3xl">Unirse a sala</h1>
      <form className="flex flex-col gap-4" onSubmit={(event) => {handleSubmit(event)}}>
        <div className="flex flex-col gap-2">
          <label className="text-center" htmlFor="maPlayers">Código de sala</label>
          <input onChange={(event)=>{handleChange(event)}} value={code} min={2} max={5} className="p-1 bg-white rounded w-full outline-0 focus:outline-2 focus:outline-amber-900 text-center text-lg font-bold" id="maxPlayers" type="text" required />
          {
            roomExists && 
          <span className="text-lg text-red-500">La sala no existe!</span>
          }
        </div>
        <button className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Unirse a sala</button>
      </form>
      <button onClick={()=>{handleRoom(code)}} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">get room</button>
    </div>
  );
};

export default JoinRoom;