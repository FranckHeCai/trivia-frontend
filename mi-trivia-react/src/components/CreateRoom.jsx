import { useState } from "react";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [loading, setLoading] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(1);
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
      questionsPerPlayer: questionsPerPlayer,
      started: false,
      creator: localStorage.getItem("nickname"),
    });

    // 🛑 Esperamos confirmación de que la sala fue creada
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      navigate(`/room/${roomCode}`);
    } else {
      alert("Error al crear la sala. Intenta de nuevo.");
    }

    setLoading(false);
  };

  return (
    <div className="trivia-container">
      <h2>Configuración de la Sala</h2>

      <p>Máximo de jugadores:</p>
      <input className="nickname-input"
        type="number"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
        min={2}
        max={10}
      />

      <p>Preguntas por jugador:</p>
      <input className="nickname-input"
        type="number"
        value={questionsPerPlayer}
        onChange={(e) => setQuestionsPerPlayer(parseInt(e.target.value))}
        min={1}
        max={5}
      />

      <button className="button" onClick={handleCreate} disabled={loading} style={{ marginTop: "1rem", width: "420px", padding: "20px" }}>
        {loading ? "Creando..." : "Crear nueva sala"}
      </button>
    </div>
  );
}
