import { useNavigate } from "react-router-dom";
import { useTriviaStore } from "../store/store";

const Welcome = () => {
  const { player, setPlayer } = useTriviaStore(state => state)

  const navigate = useNavigate()

  const handleClick = (route) => {
    navigate(`/${route}`)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-2 sm:p-5  gap-10" >
      <div className="">
        <h1 className="text-xl ">Bienvenido, </h1>
        <h2 className="text-4xl font-medium">{player.nickname}!</h2>
      </div>
      <div className=" sm:w-sm text-sm text-amber-950">
        <p>Quien conoce mejor a quien ? Reta a tus amigos creando una sala o uniendote a una.</p>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={()=>{handleClick("create-room")}} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Crear sala</button>
        <button onClick={()=>{handleClick("join-room")}} className="border-2 border-amber-900 px-8 py-2 text-lg text-white bg-amber-600/80 active:bg-lime-500 active:border-lime-800 rounded">Unirse a sala</button>
      </div>
    </div>
  );
};

export default Welcome;