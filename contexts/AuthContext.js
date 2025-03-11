import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/userSlice';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();

    // Функция проверки срока действия токена
    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            // Если время истечения токена меньше текущего времени, то токен истек
            return decoded.exp < currentTime;
        } catch (error) {
            return true; // В случае ошибки считаем, что токен истек
        }
    };

    // Функция для обновления токена
    const refreshToken = async (oldToken) => {
        try {
            const response = await fetch('/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${oldToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                return data.token;
            }
            return null;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    };
    
    // Функция для получения действительного токена
    const getValidToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        // Если токен действителен, возвращаем его
        if (!isTokenExpired(token)) return token;
        
        // Если токен истек, пытаемся обновить его
        const newToken = await refreshToken(token);
        return newToken;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            
            // Получаем действительный токен
            const token = await getValidToken();
            
            if (token) {
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
                            companyId: userData.companyId,
                            company: userData.company,
                        });
                        dispatch(setUser(userData));

                        // Перенаправляем пользователя только после логина
                        if (!user) {
                            router.push(router.asPath); // Обновление страницы
                        }
                    } else {
                        // Если не удалось получить данные пользователя, очищаем состояние
                        localStorage.removeItem('token');
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
            } else {
                // Если нет токена или не удалось обновить его
                localStorage.removeItem('token');
                setUserState(null);
                dispatch(clearUser());
                setLoading(false);
            }
        };
        
        fetchUserData();

        // Установим интервал для периодической проверки токена
        const tokenCheckInterval = setInterval(async () => {
            const token = localStorage.getItem('token');
            if (token && isTokenExpired(token)) {
                console.log("Token is expired, refreshing...");
                const newToken = await refreshToken(token);
                if (!newToken) {
                    // Если не удалось обновить токен, выполняем выход
                    console.log("Could not refresh token, logging out");
                    localStorage.removeItem('token');
                    setUserState(null);
                    dispatch(clearUser());
                } else {
                    console.log("Token refreshed successfully");
                }
            }
        }, 5 * 60 * 1000); // Проверяем каждые 5 минут
        
        // Очистка интервала при размонтировании компонента
        return () => clearInterval(tokenCheckInterval);
    }, [dispatch, router]); // Убрали user из зависимостей

    return (
        <AuthContext.Provider value={{ user, loading, setUserState }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);