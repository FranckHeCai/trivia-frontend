import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayers } from "../services/api";
import { players } from "../mock/player";

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
    <div className="flex flex-col gap-5 p-2 items-center justify-center min-h-screen bg-gradient-to-b from-purple-500 to-pink-500 text-white">
      <h1 className="text-2xl sm:text-4xl">Final de partida</h1>
      <div className="w-full max-w-2xl bg-white text-black rounded-lg shadow-lg p-6">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.nickname}
            className={`flex flex-col items-center sm:flex-row sm:items-center sm:justify-between p-4 mb-4 rounded-lg text-lg shadow-md ${
              index === 0
                ? "bg-yellow-400 text-black"
                : index === 1
                ? "bg-gray-300 text-black"
                : index === 2
                ? "bg-orange-400 text-black"
                : "bg-gray-100"
            }`}
          >
            <div className="flex flex-col gap-2 sm:flex-row  justify-center items-center text-center">
              <picture className="w-12 h-12 rounded-full border-2 overflow-hidden">
                <img
                  src={`/public/avatars/${player.avatar}.svg`}
                  alt={player.avatar}
                  className="w-full scale-105"
                />
              </picture>
              <span>{player.nickname}</span>
            </div>
            <span className="text-xl">{player.score} ptos</span>
          </div>
        ))}

      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
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