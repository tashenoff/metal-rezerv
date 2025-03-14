import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ActivityTimeline from '../components/ActivityTimeline/ActivityTimeline';
import ResponseSummary from '../components/ResponseSummary';
import EffectivenessDisplay from '../components/EffectivenessDisplay';
import { useAuth } from '../contexts/AuthContext';
import { getTranslations } from '../utils/getTranslations';
import { getSession } from 'next-auth/react';

const UserActivityTimeline = () => {
    const [responses, setResponses] = useState([]);
    const [userLevel, setUserLevel] = useState('');
    const [feedback, setFeedback] = useState('');
    const { user, loading } = useAuth();
    const router = useRouter();

    // Получаем состояние NextAuth
    const nextAuthEnabled = process.env.NEXT_PUBLIC_NEXTAUTH_ENABLED === 'true';

    useEffect(() => {
        // Если данные загружаются, ждем
        if (loading) {
            console.log('Данные загружаются...');
            return;
        }

        // Если пользователь не найден, показываем сообщение об ошибке
        if (!user) {
            console.log('Пользователь не найден после загрузки');
            setFeedback('Вы должны быть авторизованы для доступа к активности.');
            return;
        }

        // Когда пользователь загружен, запрашиваем его данные
        if (user && user.id) {
            console.log('Пользователь найден:', user);
            fetchResponses(user.id);
        }
    }, [user, loading]);

    const fetchResponses = async (responderId) => {
        try {
            const res = await fetch(`/api/responses/getResponses?responderId=${responderId}`);
            if (res.ok) {
                const data = await res.json();
                setResponses(data.responses);
                updateUserLevel(responderId);
            } else {
                console.error('Ошибка при загрузке откликов:', res.status);
                setFeedback('Ошибка при загрузке откликов.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке откликов:', error);
            setFeedback('Ошибка при загрузке откликов.');
        }
    };

    const updateUserLevel = async (responderId) => {
        try {
            const res = await fetch(`/api/responder/${responderId}`);
            if (res.ok) {
                const data = await res.json();
                setUserLevel(data.level);
            } else {
                console.error('Ошибка при получении уровня пользователя:', res.statusText);
            }
        } catch (error) {
            console.error('Ошибка при обновлении уровня пользователя:', error);
        }
    };

    return (
        <Layout>
            {loading ? (
                <p className="text-gray-500">Загрузка данных...</p>
            ) : (
                !user ? (
                    <p className="text-red-500 mb-4">{feedback}</p>
                ) : (
                    <>
                        <EffectivenessDisplay level={userLevel} />
                        <div className='flex w-full justify-between items-center'>
                            <ResponseSummary responses={responses} />
                        </div>
                        <div>
                            <ActivityTimeline user={user} responses={responses} />
                        </div>
                    </>
                )
            )}
        </Layout>
    );
};

export async function getServerSideProps(context) {
    const { locale } = context;
    const nextAuthEnabled = process.env.NEXT_PUBLIC_NEXTAUTH_ENABLED === 'true';
    
    // Если включен NextAuth, проверяем сессию на сервере
    if (nextAuthEnabled) {
        const session = await getSession(context);
        
        // Если нет сессии, перенаправляем на страницу входа
        if (!session) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }
        
        // Иначе передаем сессию в props
        return {
            props: {
                ...(await getTranslations(locale, ['common', 'activity'])),
                session,
            },
        };
    }
    
    // Если NextAuth не включен, используем стандартную логику
    return {
        props: {
            ...(await getTranslations(locale, ['common', 'activity'])),
        },
    };
}

export default UserActivityTimeline;

