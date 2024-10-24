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

  // Создаем 4 пользователей с ролью PUBLISHER
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
        city: 'Астана',
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
        companyBIN: '333333333',
        phoneNumber: '7779876543',
        city: 'Алматы',
        country: 'Казахстан',
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
        phoneNumber: '7776543210',
        city: 'Шымкент',
        country: 'Казахстан',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Евгений Смирнов',
        email: 'publisher4@example.com',
        password: hashedPasswordPublisher,
        role: 'PUBLISHER',
        points: null,
        companyName: 'Publisher Company 4',
        companyBIN: '555555555',
        phoneNumber: '7773216549',
        city: 'Караганда',
        country: 'Казахстан',
        registrationDate: new Date(),
        isCompanyVerified: false,
      },
    }),
  ]);

  // Создаем 4 респондента
  const responders = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Анастасия Кузнецова',
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
    }),
    prisma.user.create({
      data: {
        name: 'Максим Орлов',
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
    }),
    prisma.user.create({
      data: {
        name: 'Ирина Николаева',
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
    }),
    prisma.user.create({
      data: {
        name: 'Владимир Федоров',
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
    }),
  ]);

  // Устанавливаем expirationDate на 10 минут вперед
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 10);

  // Создаем объявления
  const listings = await Promise.all([
    prisma.listing.create({
      data: {
        title: 'Требуется арматура для строительных работ в Астане',
        content: `Нужна арматура диаметром от 10 до 32 мм. Рассмотрим предложения от поставщиков в Астане.

        Мы ищем надежных поставщиков, которые смогут обеспечить качественную арматуру в нужных количествах. 
        
        Обратите внимание, что важным критерием является цена и сроки доставки. Если вы можете предложить конкурентные условия, пожалуйста, свяжитесь с нами.`,
        published: true,
        authorId: publishers[0].id,
        deliveryDate: new Date(),
        publishedAt: new Date(),
        purchaseDate: new Date('2024-10-01'),
        expirationDate: expirationDate,
      },
    }),
    prisma.listing.create({
      data: {
        title: 'Предложение: Стальной прокат в Алматы',
        content: `Ищем поставщиков стального проката в Алматы. 
        Нам требуется качество и своевременная доставка.

        Если у вас есть предложение, пожалуйста, свяжитесь с нами!`,
        published: true,
        authorId: publishers[1].id,
        deliveryDate: new Date(),
        publishedAt: new Date(),
        purchaseDate: new Date('2024-10-01'),
        expirationDate: expirationDate,
      },
    }),
    prisma.listing.create({
      data: {
        title: 'Заказ металлических конструкций в Шымкенте',
        content: `Ищем надежного поставщика металлических конструкций. 
        Пожалуйста, предложите свои условия и цены.

        Мы работаем только с качественными материалами.`,
        published: true,
        authorId: publishers[2].id,
        deliveryDate: new Date(),
        publishedAt: new Date(),
        purchaseDate: new Date('2024-10-01'),
        expirationDate: expirationDate,
      },
    }),
    prisma.listing.create({
      data: {
        title: 'Требуются металлические трубы в Караганде',
        content: `В Караганде требуется поставка металлических труб. 
        Ожидаем предложений с конкурентоспособными ценами.

        Пожалуйста, свяжитесь с нами.`,
        published: true,
        authorId: publishers[3].id,
        deliveryDate: new Date(),
        publishedAt: new Date(),
        purchaseDate: new Date('2024-10-01'),
        expirationDate: expirationDate,
      },
    }),
  ]);

  // Создаем отклики на объявления
  await Promise.all([
    prisma.response.create({
      data: {
        responderId: responders[0].id,
        message: 'Я могу предложить вам качественную арматуру по лучшей цене. Свяжитесь со мной!',
        listingId: listings[0].id,
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      },
    }),
    prisma.response.create({
      data: {
        responderId: responders[1].id,
        message: 'У нас есть отличные предложения на стальной прокат. Ждем вашего звонка!',
        listingId: listings[1].id,
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      },
    }),
    prisma.response.create({
      data: {
        responderId: responders[2].id,
        message: 'Мы можем предложить качественные металлические конструкции. Свяжитесь с нами для подробностей!',
        listingId: listings[2].id,
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      },
    }),
    prisma.response.create({
      data: {
        responderId: responders[3].id,
        message: 'Предлагаем выгодные условия по поставке металлических труб. Ждем вашего ответа!',
        listingId: listings[3].id,
        status: 'pending',
        createdAt: new Date(),
        accepted: null,
      },
    }),
  ]);

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
