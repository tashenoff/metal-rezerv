import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ActivityTimeline from '../components/ActivityTimeline/ActivityTimeline';
import ResponseSummary from '../components/ResponseSummary';
import EffectivenessDisplay from '../components/EffectivenessDisplay';
import { useAuth } from '../contexts/AuthContext';

const UserActivityTimeline = () => {
    const [responses, setResponses] = useState([]);
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
            setResponses(data);
        } else {
            setFeedback('Ошибка при загрузке откликов.');
        }
    };

    return (
        <Layout>

            {loading && <p className="text-gray-500">Загрузка данных...</p>}
            {!loading && feedback && <p className="text-red-500 mb-4">{feedback}</p>}
            <div className='grid lg:grid-cols-12 gap-4'>
                <div className='lg:col-span-8 order-2'>
                    <ActivityTimeline user={user} responses={responses} />
                </div>
                <div className='lg:col-span-4'>
                    <ResponseSummary responses={responses} />
                    <EffectivenessDisplay responses={responses} />
                </div>
            </div>

        </Layout>
    );
};

export default UserActivityTimeline;
