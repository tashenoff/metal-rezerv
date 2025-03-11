import { useRouter } from 'next/router';

const CompanyActions = () => {
  const router = useRouter();

  // Данные для вывода
  const actions = [
    {
      title: 'Создать компанию',
      description:
        'Простой процесс регистрации, полное управление всеми аспектами бизнеса и возможность привлечь талантливых сотрудников. Начните уже сегодня и откройте новые горизонты для вашего успеха.',
      buttonText: 'Создать компанию',
      buttonAction: () => router.push('/company/create-company', undefined, { shallow: false }),
      bgColor: 'bg-blue-200', // Цвет фона
    },
    {
      title: 'Присоединиться к компании',
      description:
        'Стать частью команды мечты! Присоединяйтесь к компании, которая разделяет ваши ценности и цели. Получите доступ к уникальным возможностям развития, участвуйте в проектировании будущего и добивайтесь успеха вместе с нами.',
      buttonText: 'Присоединиться',
      buttonAction: () => router.push('/company/join-company'),
      bgColor: 'bg-accent', // Цвет фона
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <div
          key={index}
          className={`${action.bgColor} text-black p-5 w-full rounded-lg shadow-md`}
        >
          <h1 className="text-xl font-bold">{action.title}</h1>
          <p className="my-4">{action.description}</p>
          <button
            className="btn btn-primary mt-4"
            onClick={action.buttonAction}
          >
            {action.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CompanyActions;
