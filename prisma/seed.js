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
  const publisherPassword = 'publisherPassword';
  const responderPassword = 'responderPassword';

  const hashedPasswordPublisher = await bcrypt.hash(publisherPassword, 10);
  const hashedPasswordResponder = await bcrypt.hash(responderPassword, 10);

  // Создаем 100 уникальных публишеров
  const publishers = [];
  for (let i = 0; i < 100; i++) {
    const publisher = await prisma.user.create({
      data: {
        name: `Publisher ${i + 1}`,
        email: `publisher${i + 1}@example.com`,
        password: hashedPasswordPublisher,
        role: 'PUBLISHER',
        points: null,
        companyName: `Publisher Company ${i + 1}`,
        companyBIN: `BIN${100000000 + i}`,
        phoneNumber: `7771000${i.toString().padStart(4, '0')}`,
        city: i % 2 === 0 ? 'Алматы' : 'Нур-Султан',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    });
    publishers.push(publisher);

    // Выводим информацию о созданном публишере
    console.log(`Публишер создан: email: publisher${i + 1}@example.com, password: ${publisherPassword}`);
  }

  // Создаем 100 уникальных респондентов
  const responders = [];
  for (let i = 0; i < 100; i++) {
    const responder = await prisma.user.create({
      data: {
        name: `Responder ${i + 1}`,
        email: `responder${i + 1}@example.com`,
        password: hashedPasswordResponder,
        role: 'RESPONDER',
        points: 5, // начальные баллы для респондентов
        companyName: `Responder Company ${i + 1}`,
        companyBIN: `BIN${200000000 + i}`,
        phoneNumber: `7772000${i.toString().padStart(4, '0')}`,
        city: i % 2 === 0 ? 'Астана' : 'Шымкент',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    });
    responders.push(responder);

    // Выводим информацию о созданном респонденте
    console.log(`Респондент создан: email: responder${i + 1}@example.com, password: ${responderPassword}`);
  }

  // Создаем 100 уникальных объявлений от 100 публишеров
  const listings = [];
  for (let i = 0; i < 100; i++) {
    const listing = await prisma.listing.create({
      data: {
        title: `Объявление ${i + 1}`,
        content: `Описание объявления ${i + 1}. Требуется строительный материал.`,
        published: true,
        authorId: publishers[i].id, // Каждое объявление от уникального публишера
        deliveryDate: new Date(),
        publishedAt: new Date(),
        purchaseDate: new Date('2024-10-01'),
      },
    });
    listings.push(listing);
  }

  // Создаем по 10 откликов на каждое объявление от разных респондентов
  for (let i = 0; i < 100; i++) {
    const responses = [];
    for (let j = 0; j < 10; j++) {
      const message = `Отклик на объявление ${i + 1} от респондента ${j + 1}: Я могу предложить вам решение. Свяжитесь со мной.`;

      responses.push({
        responderId: responders[(i * 10 + j) % 100].id, // Уникальный респондент
        message: message,
        listingId: listings[i].id, // Все отклики привязаны к конкретному объявлению
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      });
    }
    
    // Создаем 10 откликов для текущего объявления
    await prisma.response.createMany({
      data: responses,
    });
  }

  console.log('100 уникальных объявлений и 1000 откликов созданы!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
