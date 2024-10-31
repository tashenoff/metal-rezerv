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

  // Удаляем все категории
  await prisma.category.deleteMany({});

  // Создаем категории
  const category1 = await prisma.category.create({
    data: {
      name: 'Строительные материалы',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Металлы',
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: 'Инструменты',

    },
  });

  // Хэшируем пароли
  const hashedPasswordPublisher = await bcrypt.hash('publisherPassword', 10);
  const hashedPasswordResponder = await bcrypt.hash('responderPassword', 10);

  // Создаем одного публишера
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
      city: 'Астана',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  // Создаем одно объявление с категорией
  const listing = await prisma.listing.create({
    data: {
      title: 'Требуется арматура для строительных работ в Астане',
      content: `Нужна арматура диаметром от 10 до 32 мм. Рассмотрим предложения от поставщиков в Астане.`,
      published: true,
      authorId: publisher.id,
      categoryId: category1.id,  // Привязываем категорию
      deliveryDate: new Date(),
      publishedAt: new Date(),
      purchaseDate: new Date('2024-10-01'),
      expirationDate: new Date(new Date().setMinutes(new Date().getMinutes() + 10)),
    },
  });

  // Создаем респондентов
  const responder1 = await prisma.user.create({
    data: {
      name: 'Респондент 1',
      email: 'responder1@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 10,
      companyName: 'Responder Company 1',
      companyBIN: '666666666',
      phoneNumber: '7771234567',
      city: 'Астана',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  // Создаем отклики
  await prisma.response.create({
    data: {
      responderId: responder1.id,
      message: 'Я могу предложить арматуру по выгодной цене.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  console.log('Данные успешно добавлены');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
