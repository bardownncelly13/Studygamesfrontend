import { useAuth } from "../context/Authcontext"
const Adddeck = ({ isSelected, onClick, button }) => {

  const { user } = useAuth();

  let borderColorClass;
  switch (isSelected) {
    case true:
      borderColorClass = "border-blue-500";
      break;
    case false:
      borderColorClass = "border-light-100/10"; 
      break;
    default:
      borderColorClass = "border-light-100/10";
  }
  return (
   <div
    className={`deck-card bg-dark-100 p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer text-center border ${borderColorClass}`}
    onClick={onClick}
  >
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <h3 className="text-xl font-semibold text-white mb-2">Add a Deck</h3>

          <button className="w-16 h-16 flex items-center justify-center rounded-full bg-light-100/20 text-white text-3xl 
              hover:bg-light-100/30 hover:scale-110 hover:shadow-lg transition-all duration-200"
              onClick={(e) => {
                  e.stopPropagation();  
                  if(user){ 
                    button(true)       
                  }
                  else{
                    alert("You need to be signed in to add a deck");
                  }

              }}>
              +   
          </button>
      
  </div>
</div>
  );
};

export default Adddeck;