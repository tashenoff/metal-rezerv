// pages/UserActivityTimeline.js
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
        if (!loading) {
            if (user && user.id) {
                fetchResponses(user.id);
            } else {
                setFeedback('Вы должны быть авторизованы для доступа к активности.');
               
            }
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
            <div className="container mx-auto py-6 px-4">
                {loading && <p className="text-gray-500">Загрузка данных...</p>}
                {!loading && feedback && <p className="text-red-500 mb-4">{feedback}</p>}
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-8'>
                        <ActivityTimeline user={user} responses={responses} />
                    </div>
                    <div className='col-span-4'>
                        <ResponseSummary responses={responses} />
                        <EffectivenessDisplay responses={responses} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserActivityTimeline;
