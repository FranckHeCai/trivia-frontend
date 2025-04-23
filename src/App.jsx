import { BrowserRouter, Routes, Route } from 'react-router'
import Start from "@/pages/Start"
import Error from '@/pages/Error'
import Welcome from '@/pages/Welcome'
import CreateRoom from '@/pages/CreateRoom'
import JoinRoom from "@/pages/JoinRoom"
import Lobby from '@/pages/Lobby'
import Questions from '@/pages/Questions'


function App() {

  return (
    <div className='bg-amber-500/20'>
        <BrowserRouter>
        <Routes>   
            <Route index element={<Start />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/lobby" element={<Welcome />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/lobby/:roomCode" element={<Lobby />} />
            <Route path="*" element={<Error />} />
        </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
