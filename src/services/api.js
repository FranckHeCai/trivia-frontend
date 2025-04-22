import axios from 'axios';
export const i = axios.create({ baseURL: 'https://localhost:3000' });
export const createRoom = room =>{
  i.post("/rooms", room)
}