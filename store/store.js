// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Импортируйте ваш редьюсер

const store = configureStore({
    reducer: {
        user: userReducer, // Добавьте редьюсер пользователя
    },
});

export default store;
