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
  const hashedPasswordAdmin = await bcrypt.hash('adminPassword', 10);
  const hashedPasswordPublisher = await bcrypt.hash('publisherPassword', 10);
  const hashedPasswordResponder = await bcrypt.hash('responderPassword', 10);

  // Создаем администратора
  const admin = await prisma.user.create({
    data: {
      name: 'Аманжол Тулебаев1',
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
      points: null,
      companyName: 'Admin Company',
      companyBIN: '111111111',
      phoneNumber: '7771234567',
      city: 'Нур-Султан',
      registrationDate: new Date(),
    },
  });

  // Создаем пользователя с ролью PUBLISHER
  const publisher = await prisma.user.create({
    data: {
      name: 'Алия Султанова',
      email: 'publisher@example.com',
      password: hashedPasswordPublisher,
      role: 'PUBLISHER',
      points: null,
      companyName: 'Publisher Company',
      companyBIN: '222222222',
      phoneNumber: '7777654321',
      city: 'Алматы',
      registrationDate: new Date(),
    },
  });

  // Создаем пользователей с ролью RESPONDER
  const responder1 = await prisma.user.create({
    data: {
      name: 'Данияр Мусабеков',
      email: 'responder1@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 10,
      companyName: 'Daniya Company',
      companyBIN: '333333333',
      phoneNumber: '7772345678',
      city: 'Шымкент',
      registrationDate: new Date(),
    },
  });

  const responder2 = await prisma.user.create({
    data: {
      name: 'Сауле Байгулова',
      email: 'responder2@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 15,
      companyName: 'Saule Company',
      companyBIN: '444444444',
      phoneNumber: '7778765432',
      city: 'Караганда',
      registrationDate: new Date(),
    },
  });

  // Создаем несколько объявлений по теме металлопроката с требованиями
  const listings = await prisma.listing.createMany({
    data: [
      {
        title: 'Требуется арматура для строительных работ',
        content: 'Нужна арматура диаметром от 10 до 32 мм. Рассмотрим предложения от поставщиков.',
        published: true,
        authorId: publisher.id,
        deliveryDate: new Date(),
        publishedAt: new Date(),
      },
      {
        title: 'Ищем стальные листы',
        content: 'Требуются стальные листы различных размеров для производства. Срочно!',
        published: true,
        authorId: publisher.id,
        deliveryDate: new Date(),
        publishedAt: new Date(),
      },
      {
        title: 'Требуются трубы стальные: опт и розница',
        content: 'Ищем поставщиков стальных труб различных диаметров. Предложения с ценами приветствуются.',
        published: true,
        authorId: publisher.id,
        deliveryDate: new Date(),
        publishedAt: new Date(),
      },
    ],
  });

  // Получаем созданные объявления для добавления откликов
  const allListings = await prisma.listing.findMany();

  // Создаем отклики на объявления
  await prisma.response.createMany({
    data: [
      {
        responderId: responder1.id,
        message: 'Здравствуйте! Я могу предложить арматуру по хорошей цене. Свяжитесь со мной, пожалуйста.',
        listingId: allListings[0].id, // Отклик на первое объявление
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      },
      {
        responderId: responder2.id,
        message: 'Добрый день! У меня есть стальные листы нужного размера. Жду вашего ответа.',
        listingId: allListings[1].id, // Отклик на второе объявление
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      },
      {
        responderId: responder1.id,
        message: 'Здравствуйте! Я могу предложить трубы в необходимых объемах. Напишите, если интересно.',
        listingId: allListings[2].id, // Отклик на третье объявление
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      },
    ],
  });

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
