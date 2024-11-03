import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        role: null,
        points: 0,
        username: '',
        id: null,
        city: '', // Новое поле
        companyName: '', // Новое поле
        // Добавьте другие поля, если нужно
    },
    reducers: {
        setUser: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.role = action.payload.role;
            state.points = action.payload.points;
            state.username = action.payload.username;
            state.id = action.payload.id;
            state.city = action.payload.city; // Обновите состояние city
            state.companyName = action.payload.companyName; // Обновите состояние companyName
            // Обновите другие поля, если нужно
        },
        clearUser: (state) => {
            state.isLoggedIn = false;
            state.role = null;
            state.points = 0;
            state.username = '';
            state.id = null;
            state.city = ''; // Очистите поле city
            state.companyName = ''; // Очистите поле companyName
            // Очистите другие поля, если нужно
        },
    },
});


export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
