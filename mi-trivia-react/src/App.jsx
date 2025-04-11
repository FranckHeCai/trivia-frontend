import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Room from "./components/Rooms";

export default function App() {
  return (
    <Router>
      <div className="trivia-container">
        <h1>🎉 Trivia Multijugador</h1>

        <Routes>
          {/* Página de inicio */}
          <Route
            path="/"
            element={
              <div>
                <p>Elige una opción:</p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
                  <Link to="/create">
                    <button>Crear Sala</button>
                  </Link>
                  <Link to="/join">
                    <button>Unirse a Sala</button>
                  </Link>
                </div>
              </div>
            }
          />

          {/* Crear sala */}
          <Route path="/create" element={<CreateRoom />} />

          {/* Unirse a sala */}
          <Route path="/join" element={<JoinRoom />} />

          {/* Sala para jugar */}
          <Route path="/room/:code" element={<Room />} />
        </Routes>
      </div>
    </Router>
  );
}
