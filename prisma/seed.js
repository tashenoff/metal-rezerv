const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Удаляем данные из всех зависимых таблиц в правильном порядке
  await prisma.pointsSpent.deleteMany({});
  await prisma.response.deleteMany({});
  await prisma.companyEmployee.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

  // Создаем категории
  const category1 = await prisma.category.create({ data: { name: 'Строительные материалы' } });

  // Хэшируем пароли
  const hashedPasswordPublisher = await bcrypt.hash('publisherPassword', 10);
  const hashedPasswordResponder = await bcrypt.hash('responderPassword', 10);

  // Создаем пользователя-публишера (администратора компании)
  const publisher = await prisma.user.create({
    data: {
      name: 'Алия Султанова',
      email: 'publisher@example.com',
      password: hashedPasswordPublisher,
      role: 'PUBLISHER',
      phoneNumber: '7777654321',
      city: 'Астана',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: true,
      level: 'NOVICE',
    },
  });

  // Создаем компанию, устанавливая создателя как администратора
  const company = await prisma.company.create({
    data: {
      name: 'Publisher Company',
      binOrIin: '222222222',
      region: 'Астана',
      contacts: 'Контактная информация компании',
      director: 'Алия Султанова',
      rating: 4.5,
      ownerId: publisher.id, // Привязка к создателю как владельцу компании
    },
  });

  // Добавляем запись о пользователе как сотруднике компании с ролью администратора
  await prisma.companyEmployee.create({
    data: {
      userId: publisher.id,
      companyId: company.id,
      role: 'Администратор', // Роль создателя компании
      joinedAt: new Date(),
    },
  });

  // Создаем объявление с категорией, responseCost, paymentTerms, type и purchaseMethod
  const listing = await prisma.listing.create({
    data: {
      title: 'Требуется арматура для строительных работ в Астане',
      content: 'Нужна арматура диаметром от 10 до 32 мм. Рассмотрим предложения от поставщиков в Астане.',
      published: true,
      authorId: publisher.id,
      categoryId: category1.id,
      deliveryDate: new Date(),
      publishedAt: new Date(),
      purchaseDate: new Date('2024-10-01'),
      expirationDate: new Date(new Date().setMinutes(new Date().getMinutes() + 10)),
      responseCost: 15,
      purchaseMethod: 'Запрос ценовых предложений',
      paymentTerms: '50% предоплата, 50% после доставки',
      type: 'Товар',
    },
  });

  // Логируем условия оплаты и тип
  console.log('Условия оплаты для объявления: ', listing.paymentTerms);
  console.log('Тип объявления: ', listing.type);

  // Создаем пользователя-респондента с компанией
  const responder1 = await prisma.user.create({
    data: {
      name: 'Респондент 1',
      email: 'responder1@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 100,
      phoneNumber: '7771234567',
      city: 'Астана',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: true,
      level: 'NOVICE',
    },
  });

  const responderCompany = await prisma.company.create({
    data: {
      name: 'Responder Company',
      binOrIin: '333333333',
      region: 'Алматы',
      contacts: 'Контактная информация респондента',
      director: 'Респондент 1',
      rating: 4.2,
      ownerId: responder1.id, // Привязка к создателю как владельцу компании
    },
  });

  // Добавляем запись о пользователе как сотруднике компании с ролью администратора
  await prisma.companyEmployee.create({
    data: {
      userId: responder1.id,
      companyId: responderCompany.id,
      role: 'Администратор',
      joinedAt: new Date(),
    },
  });

  // Создаем второго респондента и добавляем его в компанию первого респондента
  const responder2 = await prisma.user.create({
    data: {
      name: 'Респондент 2',
      email: 'responder2@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 80,
      phoneNumber: '7779876543',
      city: 'Астана',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
      level: 'NOVICE',
    },
  });

  // Добавляем второго респондента как сотрудника компании без прав администратора
  await prisma.companyEmployee.create({
    data: {
      userId: responder2.id,
      companyId: responderCompany.id,
      role: 'Сотрудник',
      joinedAt: new Date(),
    },
  });

  // Создаем отклики для объявления
  const response1 = await prisma.response.create({
    data: {
      responderId: responder1.id,
      message: 'Я могу предложить арматуру по выгодной цене.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  const response2 = await prisma.response.create({
    data: {
      responderId: responder2.id,
      message: 'У нас есть в наличии арматура с доставкой.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  // Списываем баллы через PointsSpent
  await prisma.pointsSpent.create({
    data: {
      userId: responder1.id,
      responseId: response1.id,
      pointsUsed: listing.responseCost,
      listingId: listing.id,
      spentAt: new Date(),
    },
  });

  await prisma.pointsSpent.create({
    data: {
      userId: responder2.id,
      responseId: response2.id,
      pointsUsed: listing.responseCost,
      listingId: listing.id,
      spentAt: new Date(),
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
