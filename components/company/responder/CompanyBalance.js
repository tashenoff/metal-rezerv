import { useEffect, useState } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/solid';

const CompanyBalance = ({ company, MAX_BALANCE }) => {
  const [balancePercentage, setBalancePercentage] = useState(0);

  useEffect(() => {
    // Рассчитываем процент баланса
    const targetPercentage = Math.min(
      (company.balance / MAX_BALANCE) * 100,
      100
    ); // Ограничиваем до 100%
    
    // Анимация увеличения процента
    let animationFrame;
    const step = () => {
      setBalancePercentage((prev) => {
        if (prev >= targetPercentage) {
          cancelAnimationFrame(animationFrame);
          return targetPercentage;
        }
        return Math.min(prev + 1, targetPercentage); // Увеличиваем постепенно
      });
      animationFrame = requestAnimationFrame(step);
    };

    step(); // Запускаем анимацию

    return () => cancelAnimationFrame(animationFrame); // Чистим эффект
  }, [company.balance, MAX_BALANCE]);

  return (
    <div className="bg-base-100 mt-10 p-2 flex items-center justify-between rounded-lg">
      <span className="flex items-center space-x-3">
        <span className="bg-base-200 p-2 rounded-full w-10 h-10 flex items-center justify-center mr-2">
          <BanknotesIcon className="w-5 h-5 rounded-full text-base-50" />
        </span>
        Баланс компании:
      </span>

      {/* Прогресс-бар с анимацией */}
      <div className="flex w-full items-center space-x-2">
        {/* Минимальное значение */}
        <span className="text-sm text-gray-600">{0}</span>
        {/* Прогресс-бар */}
        <div className="w-full bg-base-200 rounded-full h-6 mt-2 relative">
          <div
            className="bg-green-500 h-6 rounded-full transition-all"
            style={{ width: `${balancePercentage}%` }}
          ></div>
        </div>
        {/* Максимальное значение */}
        <span className="text-sm text-gray-600">{MAX_BALANCE}</span>
      </div>
    </div>
  );
};

export default CompanyBalance;
