import { useState } from "react";
import { db } from "../firebase";
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

    if (snapshot.exists()) {
      navigate(`/room/${code}`);
    } else {
      setError("La sala no existe. Verifica el código.");
    }
  };

  return (
    <div className="trivia-container">
      <h2>Unirse a Sala</h2>
      <input className="nickname-input"
        type="text"
        placeholder="Código de sala"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
      />
      <button className="button" onClick={handleJoin}>Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
