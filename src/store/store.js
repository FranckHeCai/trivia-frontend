import { create } from "zustand";

export const useTriviaStore = create ((set) => ({
  roomPlayers:[],
  setRoomPlayers: (players) => set({players}),
  player: {
    nickname: "",
    avatar: "cat",
    score: 0,
    roomId: null
  },
  setPlayer: (player) => set({player}),
  room: {
    code: "",
    isReady: false,
    maxPlayers: 0,
    maxQuestions: 0
  },
  setRoom: (room) => set({room}),
  question: {
    question_text: "",
    roomId: "",
    playerId: 0,
  },
  setQuestion: (question) => set({question}),
  isPlaying : false,
    currentMusic: {
        playlist : null, song: null, songs: []
    },
    backgroundColor: "bg-green-600",
    volume: 0.5,
    setVolume: (volume) => set({volume}),
    setBackgroundColor: ({backgroundColor}) => set({backgroundColor}),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentMusic: (currentMusic) => set({ currentMusic })
}))