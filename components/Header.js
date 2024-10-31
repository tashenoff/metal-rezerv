// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PointsDisplay from './PointsDisplay'; // Импорт компонента PointsDisplay
import UsernameDisplay from './UsernameDisplay'; // Импорт компонента UsernameDisplay
import Navbar from './Navbar';

const Header = () => {
    const router = useRouter();
    const [points, setPoints] = useState(0);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(''); // Инициализация состояния для имени пользователя
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const fetchUserData = async () => {
                const response = await fetch('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const user = await response.json();
                    setPoints(user.points);
                    setRole(user.role);
                    setUsername(user.name); // Устанавливаем имя пользователя
                }
            };
            fetchUserData();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <header>

            <Navbar
                points={points}
                role={role}
                username={username}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
            />


        </header>
    );
};

export default Header;
