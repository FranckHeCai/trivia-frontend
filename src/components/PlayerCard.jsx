const PlayerCard = ({player}) => {
  
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-md bg-amber-950/60 overflow-hidden">
      <picture className="overflow-hidden rounded">
        <img className="scale-115 object-cover" src={`/avatars/${player.avatar}.svg`} alt="" />
      </picture>
      <h3>{player.nickname}</h3>
    </div>
  );
};

export default PlayerCard;