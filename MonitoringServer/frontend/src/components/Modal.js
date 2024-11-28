import React from 'react';

const Modal = ({ imageSrc, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-16">
        <div className="relative bg-white p-4 rounded shadow-lg">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-black bg-gray-200 border border-black rounded-full w-10 h-10 hover:bg-slate-400"
            >
                &times;
            </button>
            <img src={imageSrc} alt="Screenshot" className="max-w-full max-h-[80vh]" />
        </div>
    </div>
);

export default Modal;
