// components/Header.js
import Navbar from './Navbar';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'next-auth/react';

const Header = () => {
    const { setUserState } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        // Используем NextAuth для выхода
        await signOut({ redirect: false });
        
        // Очищаем состояние пользователя
        dispatch(clearUser());
        if (setUserState) {
            setUserState(null);
        }
        
        // Перенаправляем на страницу логина
        router.push('/login');
    };

    return (
        <header>
            <Navbar handleLogout={handleLogout} />
        </header>
    );
};

export default Header;
