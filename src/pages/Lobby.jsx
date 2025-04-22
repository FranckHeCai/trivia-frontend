import { useParams } from "react-router-dom";
import { players } from "../mock/player";
import PlayerCard from "../components/PlayerCard";

const Lobby = () => {
  const { roomCode } = useParams()
  return (
    <div className="w-full h-screen flex flex-col gap-5 justify-center items-center">
      <div className="text-center">
        <h1 className="text-xl">Código de sala</h1>
        <p className="text-3xl">{roomCode}</p>
      </div>
      <div className="max-w-xs sm:max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-5">
        {
          players.map(player => <PlayerCard key={player.nickname} player={player} />)
        }
      </div>

    </div>
  );
};

export default Lobby;