import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, updateUserPoints } from '../store/userSlice';
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = useRouter();
    
    // Получаем сессию NextAuth
    const { data: session, status } = useSession();
    const nextAuthLoading = status === "loading";

    // Авторизация пользователя
    const login = async (email, password) => {
        try {
            // Используем NextAuth для авторизации
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });
            
            if (!result.error) {
                // Сразу обновим состояние пользователя, не дожидаясь эффекта
                await fetchUserData();
            }
            
            return { success: !result.error, error: result.error };
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            return { success: false, error: 'Произошла ошибка при авторизации' };
        }
    };

    // Выход из системы
    const logout = async () => {
        try {
            // Используем NextAuth для выхода
            await signOut({ redirect: false });
            
            // Очищаем состояние пользователя
            setUserState(null);
            dispatch(clearUser());
            
            // Перенаправляем на главную
            router.push('/');
            
            return { success: true };
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            return { success: false, error: 'Произошла ошибка при выходе из системы' };
        }
    };

    // Функция загрузки данных пользователя из NextAuth сессии
    const fetchUserData = async () => {
        setLoading(true);
        
        try {
            // Если сессия уже загружена и пользователь авторизован
            if (status === "authenticated" && session?.user) {
                console.log('Используем данные пользователя из NextAuth:', session.user);
                
                // Проверяем, включена ли поддержка поинтов в NextAuth
                const pointsEnabled = true;
                
                // Формируем данные пользователя
                const userData = {
                    isLoggedIn: true,
                    role: session.user.role,
                    points: pointsEnabled ? (session.user.points || 0) : 0,
                    username: session.user.name,
                    id: session.user.id,
                    responderId: session.user.responderId,
                    companyId: session.user.companyId,
                    company: session.user.company
                };
                
                console.log('User data loaded:', userData);
                
                // Обновляем состояние
                setUserState(userData);
                dispatch(setUser(userData));
                setLoading(false);
                return true;
            } else if (status === "unauthenticated") {
                // Если не авторизован
                console.log('User not authenticated');
                setUserState(null);
                dispatch(clearUser());
                setLoading(false);
                return false;
            } else {
                // Если еще загружается
                console.log('Auth status is still loading');
                return null;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
            return false;
        }
    };

    // Проверка аутентификации при запуске и обновлении данных
    useEffect(() => {
        console.log('Auth status changed:', status);
        // Если сессия готова, загружаем данные пользователя
        if (status !== "loading") {
            fetchUserData();
        }
    }, [status]);
    
    // Обновляем состояние пользователя при изменении сессии NextAuth
    useEffect(() => {
        if (session?.user && status === "authenticated") {
            console.log('Session updated:', session);
            
            // Формируем данные пользователя
            const userData = {
                isLoggedIn: true,
                role: session.user.role,
                points: session.user.points || 0,
                username: session.user.name,
                id: session.user.id,
                responderId: session.user.responderId,
                companyId: session.user.companyId,
                company: session.user.company
            };
            
            console.log('User data updated from session:', userData);
            
            // Обновляем состояние
            setUserState(userData);
            dispatch(setUser(userData));
            setLoading(false);
        }
    }, [session, status, dispatch]);

    // Добавляем функцию для перезагрузки данных пользователя
    const refreshUserData = async () => {
        return await fetchUserData();
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading: loading || nextAuthLoading, 
            setUserState,
            login,
            logout,
            refreshUserData // Добавляем новую функцию в контекст
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);