import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ActivityTimeline from '../components/ActivityTimeline/ActivityTimeline';
import ResponseSummary from '../components/ResponseSummary';
import EffectivenessDisplay from '../components/EffectivenessDisplay';
import { useAuth } from '../contexts/AuthContext';

const UserActivityTimeline = () => {
    const [responses, setResponses] = useState([]);
    const [userLevel, setUserLevel] = useState('');
    const [feedback, setFeedback] = useState('');
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Переход на страницу логина, если пользователь не авторизован
        if (!loading && !user) {
            setFeedback('Вы должны быть авторизованы для доступа к активности.');
            return; // Завершаем выполнение, чтобы избежать дальнейших проверок
        }

        // Если пользователь авторизован, загружаем его ответы
        if (!loading && user && user.id) {
            fetchResponses(user.id);
        }
    }, [user, loading, router]);

    const fetchResponses = async (responderId) => {
        const res = await fetch(`/api/responses/getResponses?responderId=${responderId}`);
        if (res.ok) {
            const data = await res.json();
            setResponses(data.responses);  // Устанавливаем отклики
            updateUserLevel(responderId);  // Обновляем уровень пользователя
        } else {
            setFeedback('Ошибка при загрузке откликов.');
        }
    };

    const updateUserLevel = async (responderId) => {
        try {
            const res = await fetch(`/api/responder/${responderId}`);
            if (res.ok) {
                const data = await res.json();
                setUserLevel(data.level); // Устанавливаем уровень пользователя из API
            } else {
                console.error('Ошибка при получении уровня пользователя:', res.statusText);
            }
        } catch (error) {
            console.error('Ошибка при обновлении уровня пользователя:', error);
        }
    };

    return (
        <Layout>
            {loading && <p className="text-gray-500">Загрузка данных...</p>}
            {!loading && feedback && <p className="text-red-500 mb-4">{feedback}</p>}
            <EffectivenessDisplay level={userLevel} />

            <div className='flex w-full justify-between items-center'>
                <ResponseSummary responses={responses} />
            
            </div>

            <div>
                <ActivityTimeline user={user} responses={responses} />
            </div>
        </Layout>
    );
};

export default UserActivityTimeline;
