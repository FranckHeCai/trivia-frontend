import { useState } from "react";
import { db } from "../services/firebase";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreate = async () => {
    setLoading(true);
    const roomCode = generateCode();
    alert(1)
    const roomRef = ref(db, `rooms/${roomCode}`);
    alert(2)
    await set(roomRef, {
      createdAt: Date.now(),
      players: [],
      started: false,
    });
    setLoading(false);
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="trivia-container">
      <h2>Crear Sala</h2>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creando..." : "Crear nueva sala"}
      </button>
    </div>
  );
}
