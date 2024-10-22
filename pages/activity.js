import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ActivityTimeline from '../components/ActivityTimeline/ActivityTimeline';
import Headlines from '../components/Headlines';

const UserActivityTimeline = () => {
    const [responses, setResponses] = useState([]);
    const [user, setUser] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                const response = await fetch('/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    fetchResponses(userData.id);
                } else {
                    setFeedback('Ошибка при загрузке данных пользователя.');
                }
            };
            fetchUserData();
        } else {
            setFeedback('Вы должны быть авторизованы для доступа к активности.');
        }
    }, []);

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
            <div className="min-h-screen ">
                <div className="container mx-auto py-6 px-4">
                    <Headlines title="Моя активность" />

                    {feedback && <p className="text-red-500 mb-4">{feedback}</p>}

                    {/* Хронология активности */}
                    <ActivityTimeline user={user} responses={responses} />
                </div>
            </div>
        </Layout>
    );
};

export default UserActivityTimeline;
