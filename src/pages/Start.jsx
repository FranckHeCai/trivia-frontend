import { useEffect, useState } from "react";
import { useTriviaStore } from "../store/store";

const Start = () => {
  const {player, setPlayer} = useTriviaStore(state => state)
  const isNicknameComplete = player.nickname.length>0
  const [avatars, setAvatars] = useState(["bull", "bunny", "cat", "crocodile", "dog", "frog", "panda", "wolf"])
  
  const handleChange = event => {
    setPlayer({...player, nickname: event.target.value})
  }

  const handleClick = avatar => {
    setPlayer({...player, avatar: avatar})
    console.log(player)
  }

  return (
    <div className="flex flex-col gap-5 p-2 bg-amber-500/10 min-h-screen">
      <h1 className="text-center text-lg sm:text-xl md:text-3xl font-bold">Super Trivia Party</h1>
      <picture className="">
        <img className="sm:w-50 h-50 m-auto bg-gray-500" src="" alt="" />
      </picture>
      <div className="w-full mx-auto sm:w-sm md:w-md lg:w-xl">
        <form onSubmit={(event) => {
          event.preventDefault()
        }} className="flex flex-col items-center p-3 rounded-lg gap-1 border-2 border-amber-950">
          <label className="text-lg font-bold">Ingresa tu apodo</label>
          <input onChange={(event)=>{
            handleChange(event)
          }} className="mb-2 bg-white p-3 rounded w-full outline-0 focus:outline-2 focus:outline-amber-900 text-center" type="text" />
          <label>Escoge un avatar</label>
          <div className="grid gap-2 sm:grid-cols-6 md:grid-cols-8 grid-cols-4 mb-2">
            {avatars.map(avatar => {
              return(
                <button onClick={()=>{ handleClick(avatar) }} className={`rounded-md ${ player.avatar === avatar ? "outline-3" : ""} overflow-hidden cursor-pointer`} key={avatar}>
                  <img className="scale-115 object-cover"  src={`avatars/${avatar}.svg`} alt={`${avatar} avatar`} />
                </button>
              )
            })}
          </div>
          { isNicknameComplete &&
            <button className="border-2 border-amber-900 px-8 py-2 text-lg font-bold text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">
              Play
            </button>
          }
        </form>
      </div>
    </div>
  );
};

export default Start;