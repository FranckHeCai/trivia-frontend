import {useState, useRef} from 'react';
import { useTriviaStore } from "../store/store";
import {io} from 'socket.io-client';

const RoomSettings = () => {
    const { room, setRoom } = useTriviaStore(state => state)
    const [newMaxPlayers, setNewMaxPlayers] = useState(room.maxPlayers);
    const [newMaxQuestions, setNewMaxQuestions] = useState(room.maxQuestions);
    const socketRef = useRef()

    if (!socketRef.current) {
        socketRef.current = io('http://localhost:3000')
    }
    const socket = socketRef.current;

    const handleSave = async () => {
        const newRoomSettings = {...room, maxPlayers: newMaxPlayers, maxQuestions: newMaxQuestions}
        await setRoom(newRoomSettings)
        socket.emit('room-settings-changed', {code: room.code , room: newRoomSettings})
      };
    
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Room Settings</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Max Players</label>
              <input
                type="number"
                value={newMaxPlayers}
                onChange={(e) => setNewMaxPlayers(Number(e.target.value))}
                className="w-full border rounded px-2 py-1"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Max Questions</label>
              <input
                type="number"
                value={newMaxQuestions}
                onChange={(e) => setNewMaxQuestions(Number(e.target.value))}
                className="w-full border rounded px-2 py-1"
                min="1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      );
};

export default RoomSettings;