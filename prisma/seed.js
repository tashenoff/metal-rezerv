const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Удаляем данные из всех зависимых таблиц в правильном порядке
  await prisma.pointsAdded.deleteMany({});
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
      title: 'Закупка строительных материалов',
      content: 'Описание закупки',
      published: true,
      authorId: publisher.id,
      categoryId: category1.id,
      responseCost: 20,
      paymentTerms: 'Предоплата 50%',
      type: 'Товар',
      purchaseMethod: 'Запрос ценового предложения',
    },
  });

  console.log('Данные успешно созданы');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
