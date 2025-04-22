import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  
  const [code, setCode] = useState("")

  const navigate = useNavigate()
  
  const handleChange = event =>{
    setCode(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    navigate(`/lobby/${code}`)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-5 w-full h-screen">
      <h1 className="text-xl sm:text-3xl">Unirse a sala</h1>
      <form className="flex flex-col gap-4" onSubmit={(event) => {handleSubmit(event)}}>
        <div className="flex flex-col gap-2">
          <label className="text-center" htmlFor="maPlayers">Código de sala</label>
          <input onChange={(event)=>{handleChange(event)}} value={code} min={2} max={5} className="p-1 bg-white rounded w-full outline-0 focus:outline-2 focus:outline-amber-900 text-center text-lg font-bold" id="maxPlayers" type="text" required />
        </div>
        <button className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Unirse a sala</button>
      </form>
    </div>
  );
};

export default JoinRoom;