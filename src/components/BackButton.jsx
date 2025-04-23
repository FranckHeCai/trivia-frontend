import { useNavigate } from "react-router-dom";
import arrowIcon from "@/icons/arrow-left.svg"

const BackButton = () => {
  const navigate = useNavigate()

  const handleBack = () =>{
    navigate(-1)
  }

  return (
          <button onClick={handleBack} className="border-2 border-red-900 px-4 py-2 text-md text-white bg-red-600/80 active:bg-red-700 active:border-red-800 rounded flex items-center gap-2">
        <img className="w-6" src={arrowIcon} alt="back icon" />
        <span>Atrás</span>
      </button>
  );
};

export default BackButton;