import React, { useState } from 'react';

const Modal = ({ imageSrc, onClose }) => {
    const [isOriginalSize, setIsOriginalSize] = useState(false);

    const handleImageDoubleClick = () => {
        if (isOriginalSize) {
            onClose(); // Close the modal if already in original size mode
        } else {
            setIsOriginalSize(true); // Show the image in original size
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-16">
            <div
                className={`relative bg-white p-4 rounded shadow-lg ${
                    isOriginalSize ? 'overflow-auto' : ''
                }`}
                style={isOriginalSize ? { maxWidth: '100vw', maxHeight: '100vh' } : {}}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-black bg-gray-200 border border-black rounded-full w-10 h-10 hover:bg-slate-400"
                >
                    &times;
                </button>
                <img
                    src={imageSrc}
                    alt="Screenshot"
                    onDoubleClick={handleImageDoubleClick}
                    className={`transition-all ${
                        isOriginalSize
                            ? 'w-auto h-auto max-w-none max-h-none'
                            : 'max-w-full max-h-[80vh]'
                    }`}
                />
            </div>
        </div>
    );
};

export default Modal;
