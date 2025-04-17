import { useTriviaStore } from "../store/store";

const Start = () => {
  const {player, setPlayer} = useTriviaStore(state => state)
  return (
    <div className="flex flex-col gap-10 p-5 bg-amber-200 min-h-screen">
      <h1 className="text-center text-lg sm:text-xl md:text-3xl font-bold">Super Trivia Party</h1>
      <picture className="">
        <img className="sm:max-w-sm h-70 m-auto bg-gray-500" src="" alt="" />
      </picture>
      <div className="w-full mx-auto sm:w-sm md:w-md lg:w-2xl">
        <form className="flex flex-col p-3 rounded-lg gap-3 border-2 border-amber-900">
          <label>Ingresa tu apodo</label>
          

        </form>
      </div>
    </div>
  );
};

export default Start;