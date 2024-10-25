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

  // Создаем одно объявление
  const listing = await prisma.listing.create({
    data: {
      title: 'Требуется арматура для строительных работ в Астане',
      content: `Нужна арматура диаметром от 10 до 32 мм. Рассмотрим предложения от поставщиков в Астане.

      Мы ищем надежных поставщиков, которые смогут обеспечить качественную арматуру в нужных количествах. 
        
      Обратите внимание, что важным критерием является цена и сроки доставки.`,
      published: true,
      authorId: publisher.id,
      deliveryDate: new Date(),
      publishedAt: new Date(),
      purchaseDate: new Date('2024-10-01'),
      expirationDate: new Date(new Date().setMinutes(new Date().getMinutes() + 10)),
    },
  });

  // Создаем десять респондентов
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

  const responder2 = await prisma.user.create({
    data: {
      name: 'Респондент 2',
      email: 'responder2@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 15,
      companyName: 'Responder Company 2',
      companyBIN: '777777777',
      phoneNumber: '7772345678',
      city: 'Алматы',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder3 = await prisma.user.create({
    data: {
      name: 'Респондент 3',
      email: 'responder3@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 20,
      companyName: 'Responder Company 3',
      companyBIN: '888888888',
      phoneNumber: '7773456789',
      city: 'Шымкент',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder4 = await prisma.user.create({
    data: {
      name: 'Респондент 4',
      email: 'responder4@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Responder Company 4',
      companyBIN: '999999999',
      phoneNumber: '7774567890',
      city: 'Караганда',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder5 = await prisma.user.create({
    data: {
      name: 'Респондент 5',
      email: 'responder5@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Responder Company 5',
      companyBIN: '123123123',
      phoneNumber: '7775678901',
      city: 'Актобе',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder6 = await prisma.user.create({
    data: {
      name: 'Респондент 6',
      email: 'responder6@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Responder Company 6',
      companyBIN: '111111111',
      phoneNumber: '7776789012',
      city: 'Талдыкорган',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });


  const alex = await prisma.user.create({
    data: {
      name: 'Респондент 6',
      email: 'alex@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 10,
      companyName: 'Responder Company 6',
      companyBIN: '111111111',
      phoneNumber: '7776789012',
      city: 'Талдыкорган',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder7 = await prisma.user.create({
    data: {
      name: 'Респондент 7',
      email: 'responder7@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Responder Company 7',
      companyBIN: '222222222',
      phoneNumber: '7777890123',
      city: 'Павлодар',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder8 = await prisma.user.create({
    data: {
      name: 'Респондент 8',
      email: 'responder8@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Responder Company 8',
      companyBIN: '333333333',
      phoneNumber: '7778901234',
      city: 'Усть-Каменогорск',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder9 = await prisma.user.create({
    data: {
      name: 'Респондент 9',
      email: 'responder9@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Responder Company 9',
      companyBIN: '444444444',
      phoneNumber: '7779012345',
      city: 'Кокшетау',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  const responder10 = await prisma.user.create({
    data: {
      name: 'Респондент 10',
      email: 'responder10@example.com',
      password: hashedPasswordResponder,
      role: 'RESPONDER',
      points: 5,
      companyName: 'Responder Company 10',
      companyBIN: '555555555',
      phoneNumber: '7770123456',
      city: 'Костанай',
      country: 'Казахстан',
      registrationDate: new Date(),
      isCompanyVerified: false,
    },
  });

  // Создаем 10 откликов
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

  await prisma.response.create({
    data: {
      responderId: responder2.id,
      message: 'Готов предложить высококачественную арматуру.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder3.id,
      message: 'Арматура в наличии, быстрое исполнение заказа.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder4.id,
      message: 'Высылаю предложение по арматуре.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder5.id,
      message: 'Лучшие условия для поставки арматуры.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder6.id,
      message: 'Можем быстро поставить арматуру нужных размеров.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder7.id,
      message: 'Предложение по арматуре на лучших условиях.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder8.id,
      message: 'Готов поставить арматуру по договоренности.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder9.id,
      message: 'Предлагаю сотрудничество по поставке арматуры.',
      listingId: listing.id,
      status: 'pending',
      createdAt: new Date(),
      accepted: null,
    },
  });

  await prisma.response.create({
    data: {
      responderId: responder10.id,
      message: 'Можем обеспечить регулярные поставки арматуры.',
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
