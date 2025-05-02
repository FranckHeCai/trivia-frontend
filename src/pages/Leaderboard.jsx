import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayers } from "../services/api";
import { players } from "../mock/player";
import crownIcon from "../icons/crown.svg"

const Leaderboard = () => {
  const { roomId } = useParams()

  useEffect(() => {
    const getRoomPlayers = async () => {
      const fetchedPlayers = await getPlayers(roomId)
    }
  }, [])

  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col p-2 items-center justify-center min-h-screen bg-gradient-to-b from-amber-300 to-orange-500/70 text-white">
      <div className="w-full sm:w-lg px-5">
        <h1 className="text-center text-2xl sm:text-4xl py-3 rounded-tl-xl rounded-tr-xl bg-amber-600">Final de partida</h1>
      </div>
      <div className=" w-full max-w-2xl bg-white text-black rounded-lg shadow-2xl p-6">
        <div className="w-full h-80 overflow-y-auto pr-2
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-amber-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-amber-400
        dark:[&::-webkit-scrollbar-track]:bg-amber-700
        dark:[&::-webkit-scrollbar-thumb]:bg-amber-500"
        >
          {sortedPlayers.map((player, index) => (
            <div
              key={player.nickname}
              className={`flex flex-col items-center pr-3 sm:flex-row sm:items-center sm:justify-between mb-3.5 rounded-lg text-lg shadow-sm border-3 
                ${index === 0
                    ? 'border-amber-400'
                    : index === 1
                      ? 'border-slate-400'
                      : index === 2
                        ? 'border-amber-700'
                        : 'border-black'
                }
                `}
            >
              <div className="flex flex-col gap-2 sm:flex-row  justify-center items-center text-center">
                <div className="flex relative">
                  <picture className="w-22 h-22 relative rounded-tl-sm rounded-bl-sm overflow-hidden">
                    <img
                      src={`/avatars/${player.avatar}.svg`}
                      alt={player.avatar}
                      className="w-full scale-108"
                    />
                  </picture>
                  { index === 0 &&
                    <img className="z-10 absolute top-[-5px] left-6.5 w-9" src={crownIcon} alt="crown logo" />
                  }
                </div>
                <span>{player.nickname}</span>
              </div>
              <span className="text-lg">{player.score} ptos</span>
            </div>
          ))}
        </div>

      <div className="mt-3 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
        <button onClick={()=>{}} className="border-2 border-amber-900 px-8 py-2 text-sm sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">
          Volver a jugar
        </button>
        <button onClick={()=>{}} className="border-2 border-amber-900 px-8 py-2 text-sm sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">
          Terminar
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default Leaderboard;