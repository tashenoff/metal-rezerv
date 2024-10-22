// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PointsDisplay from './PointsDisplay'; // Импорт компонента PointsDisplay
import UsernameDisplay from './UsernameDisplay'; // Импорт компонента UsernameDisplay

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
        <header className="border border-b border-gray-300 bg-white text-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Мое приложение</h1>
                <nav className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/listings" className="hover:underline">
                                Заявки
                            </Link>

                            {role !== 'PUBLISHER' && (
                                <>
                                    <Link href="/responses" className="hover:underline">
                                        Мои отклики
                                    </Link>
                                    <Link href="/activity" className="hover:underline">
                                        Активность
                                    </Link>
                                </>
                            )}
                            {role === 'PUBLISHER' && (
                                <div className="flex space-x-4">
                                    <Link href="/create-listing" className="hover:underline">
                                        Создать Заявку
                                    </Link>
                                    <Link href="/publisher" className="hover:underline">
                                        Мои заявки
                                    </Link>
                                </div>
                            )}

                            {/* Используем компонент UsernameDisplay для отображения имени */}
                            <UsernameDisplay username={username} />

                            {/* Используем компонент PointsDisplay для отображения баллов */}
                            <PointsDisplay points={points} role={role} />

                            <button onClick={handleLogout} className="bg-white hover:bg-gray-100 border border-gray-300 font-semibold px-3 py-1 rounded">
                                Выход
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:underline">
                                Вход
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
