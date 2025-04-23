import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./components/Start";
// import Menu from "./components/Menu"; // este lo vamos a crear ahora
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Room from "./components/Rooms";
import Menu from "./components/Menu";

export default function App() {
  return (
    <Router>
      <div className="">
        <Routes>
          {/* Pantalla de inicio: apodo y avatar */}
          <Route path="/" element={<Start />} />

          <Route path="/menu" element={<Menu />} />
          {/* Crear y unirse a salas */}
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />

          {/* Sala con jugadores y preguntas */}
          <Route path="/room/:code" element={<Room />} />
        </Routes>
      </div>
    </Router>
  );
}
