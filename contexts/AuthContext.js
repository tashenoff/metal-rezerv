import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/userSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch('/api/user', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUserState({
                            isLoggedIn: true,
                            role: userData.role,
                            points: userData.points,
                            username: userData.name,
                            id: userData.id,
                            responderId: userData.responderId,
                        });
                        dispatch(setUser(userData));

                        // Перенаправляем пользователя только после логина
                        if (!user) {
                            router.push(router.asPath); // Обновление страницы
                        }
                    } else {
                        setUserState(null);
                        dispatch(clearUser());
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUserState(null);
                    dispatch(clearUser());
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        } else {
            setUserState(null);
            setLoading(false);
        }
    }, [dispatch, router]); // Убрали user из зависимостей

    return (
        <AuthContext.Provider value={{ user, loading, setUserState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
