import { useNavigate } from "react-router-dom";
import { useTriviaStore } from "../store/store";
import { IconEdit } from '@tabler/icons-react';
import BackButton from "../components/BackButton";
import { useState } from "react";

const Welcome = () => {
  const { player, setPlayer } = useTriviaStore(state => state)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate()

  const handleClick = (route) => {
    navigate(`/${route}`)
  }

  const handleAvatarClick = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const handleAvatarSelect = (avatar) => {
    setPlayer({ ...player, avatar }); // Update the player's avatar
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-2 sm:p-5  gap-6" >
      <div className="flex flex-col text-center">
        <h1 className="text-xl ">Bienvenido, </h1>
        <h2 className="text-4xl font-medium">{player.nickname}!</h2>
        <div className="relative mt-2 flex justify-center">
          <div className="w-20 h-20 sm:w-30 sm:h-30 rounded-full overflow-hidden">
            <img
              className="w-full scale-110"
              src={`/avatars/${player.avatar}.svg`}
              alt="Avatar"
            />
          </div>
          <button onClick={handleAvatarClick} className="absolute right-3 sm:right-0 bottom-[-10px] cursor-pointer">
            <IconEdit  size={30} stroke={2}/>
          </button>
        </div>
      </div>
      <div className=" sm:w-sm text-sm sm:text-lg text-amber-950">
        <p>Quien conoce mejor a quien ? Reta a tus amigos creando una sala o uniendote a una.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button onClick={()=>{handleClick("create-room")}} className="border-2 border-amber-900 px-8 py-2 text-md sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Crear sala</button>
        <button onClick={()=>{handleClick("join-room")}} className="border-2 border-amber-900 px-8 py-2 text-md sm:text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Unirse a sala</button>
      </div>
      <BackButton />
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-950/20 flex items-center justify-center">
          <div className="flex flex-col justify-between bg-white p-3 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-md sm:text-lg mb-4 text-center">Selecciona un avatar</h3>
            <div className="grid grid-cols-3 gap-2">
              {["bull", "bunny", "cat", "crocodile", "dog", "frog", "panda", "squirrel", "wolf"].map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarSelect(avatar)}
                  className="max-w-20 max-h-20 rounded-full overflow-hidden border-3 border-gray-300 hover:border-amber-600"
                >
                  <img
                    src={`/avatars/${avatar}.svg`}
                    alt={avatar}
                    className="w-full h-full object-cover scale-105"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;