import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Leaderboard = () => {
  const { roomId } = useParams()

  useEffect(() => {
    
  }, [])
  
  return (
    <div>
      Leaderboard
    </div>
  );
};

export default Leaderboard;