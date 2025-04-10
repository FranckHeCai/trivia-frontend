import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
// Esto lo haremos luego
// import Room from './components/Room';

export default function App() {
  return (
    <Router>
      <div className="trivia-container">
        <h1>🎉 Trivia Multijugador</h1>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <p>Elige una opción:</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          {/* Ruta del juego real, que haremos después */}
          {/* <Route path="/room/:code" element={<Room />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
