import AL from "../../../../assets/EngiPic/Arrow left.png";

const NotePanel = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`flex flex-col fixed right-0 top-1/2 translate-y-[-50%] w-[46vh] h-[81.8vh] bg-white shadow-xl p-6 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-center">
        <p className="text-4xl text-black font-semibold text-center">Note</p>
      </div>
      <div className="flex flex-col h-full justify-center items-center">
        <div className="text-2xl text-black">
          XOR is like asking:
          <p>'Are these two different?'</p>
          <p>If they’re different, answer</p>
          <p>the answer is 1.</p>
          <p>If they’re the same, the is 0.</p>
        </div>
      </div>
      <button
        className="absolute bottom-4 right-4 flex items-center space-y-2 m-2 text-center"
        onClick={() => setIsOpen(false)}
      >
        <img src={AL} alt="Close" className="w-10 h-10" />
      </button>
    </div>
  );
};

export default NotePanel;
