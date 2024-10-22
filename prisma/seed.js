const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Удаляем все отклики
  await prisma.response.deleteMany({});
  
  // Удаляем все объявления
  await prisma.listing.deleteMany({});
  
  // Удаляем всех пользователей
  await prisma.user.deleteMany({});

  // Хэшируем пароли
  const hashedPasswordPublisher = await bcrypt.hash('publisherPassword', 10);
  const hashedPasswordResponder = await bcrypt.hash('responderPassword', 10);

  // Создаем 2 пользователей с ролью PUBLISHER
  const publishers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Алия Султанова',
        email: 'publisher1@example.com',
        password: hashedPasswordPublisher,
        role: 'PUBLISHER',
        points: null,
        companyName: 'Publisher Company 1',
        companyBIN: '222222222', // Преобразовано в строку
        phoneNumber: '7777654321',
        city: 'Алматы',
        country: 'Казахстан',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Дмитрий Иванов',
        email: 'publisher2@example.com',
        password: hashedPasswordPublisher,
        role: 'PUBLISHER',
        points: null,
        companyName: 'Publisher Company 2',
        companyBIN: '333333333', // Преобразовано в строку
        phoneNumber: '7779876543',
        city: 'Нур-Султан',
        country: 'Казахстан',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    }),
  ]);

  // Создаем 5 респондентов
  const responders = await Promise.all(Array.from({ length: 5 }, (_, i) => 
    prisma.user.create({
      data: {
        name: `Респондент ${i + 1}`,
        email: `responder${i + 1}@example.com`,
        password: hashedPasswordResponder,
        role: 'RESPONDER',
        points: Math.floor(Math.random() * 20), // Случайные баллы
        companyName: `Responder Company ${i + 1}`,
        companyBIN: `${(i + 5) * 111111111}`, // Преобразовано в строку
        phoneNumber: `777${Math.floor(Math.random() * 10000000)}`, // Случайный номер
        city: 'Город ' + (i + 1),
        country: 'Казахстан',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    })
  ));

  // Устанавливаем expirationDate на 10 минут вперед
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 10);

  // Создаем одно объявление
  const listing = await prisma.listing.create({
    data: {
      title: 'Требуется арматура для строительных работ',
      content: `Нужна арматура диаметром от 10 до 32 мм. Рассмотрим предложения от поставщиков.

      Мы ищем надежных поставщиков, которые смогут обеспечить качественную арматуру в нужных количествах. 

      Обратите внимание, что важным критерием является цена и сроки доставки. Если вы можете предложить конкурентные условия, пожалуйста, свяжитесь с нами.`,
      published: true,
      authorId: publishers[0].id,
      deliveryDate: new Date(),
      publishedAt: new Date(),
      purchaseDate: new Date('2024-10-01'),
      expirationDate: expirationDate,
    },
  });

// Создаем 5 откликов на одно объявление
const responses = await Promise.all(responders.map((responder) => {
  let message = `Отклик от ${responder.name}: Я могу предложить вам решение. Свяжитесь со мной.`;
  return prisma.response.create({
    data: {
      responderId: responder.id, // Используем конкретного респондента
      message: message,
      listingId: listing.id, // Используем только одно объявление
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });
}));


  console.log('Users, listings, and responses created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
