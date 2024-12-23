import React from "react";

const Modal = ({ imageSrc, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-8">
    <div className="bg-white p-1 rounded shadow-lg overflow-auto">
      <button
        onClick={onClose}
        className="absolute top-10 left-10 text-black bg-gray-200 border border-black rounded-full w-10 h-10 hover:bg-slate-400"
      >
        &times;
      </button>
      <img
        src={imageSrc}
        alt="Screenshot"
        className="transition-all w-auto h-auto max-w-none max-h-[90vh]"
      />
    </div>
  </div>
);

export default Modal;
