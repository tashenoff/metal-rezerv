import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import { updateUserPoints } from '../store/userSlice';
import DailyRewardModal from './DailyRewardModal';
import { useSession } from 'next-auth/react';

const DailyRewardChecker = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [dailyRewardStatus, setDailyRewardStatus] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // NextAuth теперь всегда включен
  const { data: session } = useSession();

  // Проверяем, включена ли система наград в useEffect, чтобы избежать ошибок рендеринга

  // Функция для проверки наличия доступной награды
  const checkDailyReward = async () => {
    if (!user || user.role !== 'RESPONDER') {
      return; // Только для респондеров
    }

    try {
      setLoading(true);
      
      // Получаем токен из сессии NextAuth
      const token = session?.legacyToken;
      
      if (!token) {
        console.error('No token available in NextAuth session for reward check');
        return;
      }
      
      console.log('Checking daily reward...');
      const response = await fetch('/api/rewards/daily', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Если код ответа 404, это может означать, что награды отключены
        if (response.status === 404) {
          console.log('Daily rewards are disabled or endpoint not found');
          return;
        }
        
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Reward status:', data);
      
      setDailyRewardStatus(data);
      
      // Показываем модальное окно только если награда доступна
      if (data.available) {
        setShowRewardModal(true);
      }
    } catch (error) {
      console.error('Error checking daily reward:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения награды
  const claimDailyReward = async () => {
    try {
      // Получаем токен из сессии NextAuth
      const token = session?.legacyToken;
      
      if (!token) {
        throw new Error('Необходима авторизация для получения награды');
      }
      
      console.log('Claiming daily reward...');
      const response = await fetch('/api/rewards/daily', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Ошибка при получении награды (${response.status})`);
      }

      const data = await response.json();
      console.log('Reward claimed successfully:', data);

      // Обновляем информацию о баллах в редаксе
      dispatch(updateUserPoints(data.currentPoints));
      
      return data;
    } catch (error) {
      console.error('Error claiming reward:', error);
      throw error;
    }
  };

  // Проверяем наличие награды при загрузке страницы
  useEffect(() => {
    // На клиенте переменные окружения могут иметь другой тип данных
    console.log('ENABLE_DAILY_REWARDS in component:', process.env.ENABLE_DAILY_REWARDS);
    console.log('Type:', typeof process.env.ENABLE_DAILY_REWARDS);
    
    // Преобразуем к строке и сравниваем строки, а не булевы значения
    const enableDailyRewards = String(process.env.ENABLE_DAILY_REWARDS).toLowerCase() === 'true';
    
    console.log('Daily rewards enabled?', enableDailyRewards);
    
    if (!enableDailyRewards) {
      console.log('Daily rewards are disabled in the client component');
      return; // Если награды отключены, ничего не делаем
    }
    
    // Проверяем наличие авторизованного пользователя и соответствующую роль
    if (user && user.role === 'RESPONDER' && session) {
      console.log('Checking daily reward for responder:', user.id);
      // Устанавливаем небольшую задержку, чтобы дать время сессии NextAuth полностью загрузиться
      const timer = setTimeout(() => {
        checkDailyReward();
      }, 1000);
      
      // Очищаем таймер при размонтировании компонента
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <>
      {dailyRewardStatus && (
        <DailyRewardModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          onClaim={claimDailyReward}
          rewardAmount={dailyRewardStatus.rewardAmount}
          isWelcomeReward={dailyRewardStatus.isWelcomeReward}
        />
      )}
    </>
  );
};

export default DailyRewardChecker;