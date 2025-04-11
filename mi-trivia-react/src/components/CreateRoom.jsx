// src/components/CreateRoom.jsx
import { useState } from "react";
import { db } from "../firebase";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [loading, setLoading] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(4);
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
    const roomRef = ref(db, `rooms/${roomCode}`);

    await set(roomRef, {
      createdAt: Date.now(),
      players: {},
      questions: {},
      maxPlayers: maxPlayers,
      started: false,
    });

    setLoading(false);
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="trivia-container">
      <h2>Crear Sala</h2>

      <label>Máximo de jugadores:</label>
      <input
        type="number"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
        min={2}
        max={10}
        style={{ padding: "10px", borderRadius: "8px", marginBottom: "1rem", width: "100%" }}
      />

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creando..." : "Crear nueva sala"}
      </button>
    </div>
  );
}
