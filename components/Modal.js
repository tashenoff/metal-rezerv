// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children, modalMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    X
                </button>

                {modalMessage}
                {children}
            </div>
        </div>
    );
};

export default Modal;
