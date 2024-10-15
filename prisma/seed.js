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

  // Создаем 3 пользователей с ролью PUBLISHER
  const publishers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Алия Султанова',
        email: 'publisher1@example.com',
        password: hashedPasswordPublisher,
        role: 'PUBLISHER',
        points: null,
        companyName: 'Publisher Company 1',
        companyBIN: '222222222',
        phoneNumber: '7777654321',
        city: 'Алматы',
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
        companyBIN: '333333333',
        phoneNumber: '7779876543',
        city: 'Нур-Султан',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Светлана Петрова',
        email: 'publisher3@example.com',
        password: hashedPasswordPublisher,
        role: 'PUBLISHER',
        points: null,
        companyName: 'Publisher Company 3',
        companyBIN: '444444444',
        phoneNumber: '7775551234',
        city: 'Алматы',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    }),
  ]);

  // Создаем респондента
  const responder = await prisma.user.create({
    data: {
      name: 'Рустам Беков',
      email: 'responder@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Rustam Company',
      companyBIN: '555555555',
      phoneNumber: '7770000000',
      city: 'Астана',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  // Создаем одно объявление
  const listing = await prisma.listing.create({
    data: {
      title: 'Требуется арматура для строительных работ',
      content: 'Нужна арматура диаметром от 10 до 32 мм. Рассмотрим предложения от поставщиков.',
      published: true,
      authorId: publishers[0].id,
      deliveryDate: new Date(),
      publishedAt: new Date(),
      purchaseDate: new Date('2024-10-01'),
    },
  });

  // Создаем 20 откликов на одно объявление
  const responses = [];
  for (let i = 0; i < 20; i++) {
    responses.push({
      responderId: responder.id,
      message: `Отклик номер ${i + 1}: Я могу предложить вам решение. Свяжитесь со мной.`,
      listingId: listing.id, // Все отклики относятся к одному объявлению
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    });
  }

  await prisma.response.createMany({
    data: responses,
  });

  console.log('Users, listing, and responses created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
