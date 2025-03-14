import { useState } from 'react';
import Modal from './Modal';

const DailyRewardModal = ({ isOpen, onClose, onClaim, rewardAmount, isWelcomeReward }) => {
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPoints, setNewPoints] = useState(null);

  const handleClaim = async () => {
    if (claimed) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onClaim();
      setClaimed(true);
      setNewPoints(result.currentPoints);
    } catch (err) {
      setError(err.message || 'Произошла ошибка при получении награды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center p-4">
        <div className="text-center">
          {!claimed ? (
            <>
              <h2 className="text-2xl font-bold mb-4">
                {isWelcomeReward ? 'Приветственная награда' : 'Ежедневная награда'}
              </h2>
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{isWelcomeReward ? '🏆' : '🎁'}</span>
                </div>
                <p className="text-lg mb-2">Поздравляем!</p>
                <p className="mb-4">
                  {isWelcomeReward 
                    ? 'Вы получили приветственную награду за регистрацию!' 
                    : 'Вы получили ежедневную награду!'}
                </p>
                <div className="py-3 px-6 rounded-lg bg-blue-100 mb-4 flex items-center justify-center">
                  <span className="font-bold text-2xl text-blue-600">+{rewardAmount} баллов</span>
                </div>
                <p className="text-sm text-gray-600">
                  {isWelcomeReward 
                    ? 'Каждый день вы можете получать бонусные баллы, возвращайтесь завтра!' 
                    : 'Возвращайтесь завтра за новой наградой!'}
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Награда получена!</h2>
              <div className="mb-6">
                <div className="w-24 h-24 rounded-full bg-green-400 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-lg mb-4">
                  Вы успешно получили <strong>{rewardAmount} баллов</strong>!
                </p>
                <div className="py-3 px-6 rounded-lg bg-green-100 mb-4">
                  <p className="font-medium">Текущий баланс:</p>
                  <p className="font-bold text-2xl text-green-600">{newPoints} баллов</p>
                </div>
                <p className="text-sm text-gray-600">
                  Возвращайтесь завтра за новой наградой!
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleClaim}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium ${
              claimed
                ? 'bg-gray-200 text-gray-800'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Получение...
              </span>
            ) : claimed ? (
              'Закрыть'
            ) : (
              'Забрать награду'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DailyRewardModal;