import axios from 'axios';
export const i = axios.create({ baseURL: 'http://localhost:3000' });

export const createRoom = async room =>{
  await i.post('/rooms', room)
}

export const getRoom = async (roomCode) => {
  const room = await i.get(`/rooms/${roomCode}`)
 return room.data
}

export const createPlayer = player => {
  i.post('/players', player)
}

export const deletePlayer = async(player) => {
  i.delete('/players/delete', 
    {
    data: player
    }
  )
}