import { useState } from "react";
import { db } from "../services/firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!code) return;
    const roomRef = ref(db, `rooms/${code}`);
    const snapshot = await get(roomRef);
alert(11)
    if (snapshot.exists()) {
      alert(22)
      navigate(`/room/${code}`);
    } else {
      setError("La sala no existe. Verifica el código.");
    }
  };

  return (
    <div className="trivia-container">
      <h2>Unirse a Sala</h2>
      <input
        type="text"
        placeholder="Código de sala"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        style={{ padding: "10px", borderRadius: "8px", marginBottom: "1rem" }}
      />
      <button onClick={handleJoin}>Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
