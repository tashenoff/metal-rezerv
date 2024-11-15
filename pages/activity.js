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
        if (loading) {
            console.log('Данные загружаются...');
            return; // Ждем завершения загрузки
        }

        if (!user) {
            console.log('Пользователь не найден после загрузки');
            setFeedback('Вы должны быть авторизованы для доступа к активности.');
            return;
        }

        if (user && user.id) {
            console.log('Пользователь найден:', user);
            fetchResponses(user.id);
        }
    }, [user, loading, router]);

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

export default UserActivityTimeline;
