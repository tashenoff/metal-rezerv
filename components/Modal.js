// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children, modalButton , modalMessage }) => {

    return (

        <dialog id="my_modal_3" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box border-primary border-2">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={onClose} // Закрываем модальное окно
                    >
                        ✕
                    </button>
                </form>
                <h3 className="text-lg font-bold">{modalMessage}</h3>
                <p className="py-4">{children}</p>

                {/* Отображаем кнопку, если она передана */}
                {modalButton && (
                    <button
                        className="btn btn-primary mt-4"
                        onClick={modalButton.onClick} // Логика при нажатии кнопки
                    >
                        {modalButton.label}
                    </button>
                )}

            </div>
        </dialog>

    );
};

export default Modal;
