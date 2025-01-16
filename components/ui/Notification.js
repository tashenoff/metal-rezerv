import { useState, useEffect } from 'react';

const Notification = ({ message, type }) => {
    const [visible, setVisible] = useState(true);  // Состояние для контроля видимости уведомления
    const [progress, setProgress] = useState(100); // Для индикатора прогресса

    useEffect(() => {
        if (!message) return;  // Если нет сообщения, ничего не делаем

        // Таймер для исчезновения уведомления
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000); // Уведомление исчезает через 5 секунд

        // Таймер для индикатора прогресса
        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(progressTimer);
                    return 0;
                }
                return prev - 2; // Каждые 100мс уменьшать прогресс на 2%
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(progressTimer);
        };
    }, [message]);

    if (!visible) return null; // Если уведомление не видно, не рендерим его

    return (
        <div className={`alert ${type === 'error' ? 'alert-error' : 'alert-success'} transition-opacity duration-500`}>
            <div className="flex justify-between items-center">
                <div className="flex-grow">{message}</div>
                <div className="w-2/5">
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 uppercase">{progress > 0 ? `${progress}%` : 'Завершено'}</span>
                            </div>
                        </div>
                        <div className="flex mb-2">
                            <div className="w-full bg-gray-200 rounded-full">
                                <div
                                    className={`bg-${type === 'error' ? 'red' : 'green'}-500 text-xs font-semibold leading-none py-1 text-center text-white`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
