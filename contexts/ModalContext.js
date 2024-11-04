import React, { createContext, useContext, useState } from 'react';
import Modal from '../components/Modal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalContent, setModalContent] = useState(null);
    
    const [isOpen, setIsOpen] = useState(false); // Состояние для управления видимостью

    const openModal = ({ type, message, component }) => {
        setModalContent({ type, message, component });
        setIsOpen(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setIsOpen(false); // Закрываем модальное окно
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isOpen, modalContent }}>
            {children}
            <Modal />
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
