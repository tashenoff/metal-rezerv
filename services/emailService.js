// emailService.js
const nodemailer = require('nodemailer');

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Отправка уведомления публишеру о новом отклике
 * @param {string} publisherEmail - Email владельца объявления
 * @param {Object} listingInfo - Информация об объявлении
 * @param {Object} responderInfo - Информация о человеке, оставившем отклик
 * @param {string} responseMessage - Текст отклика
 * @returns {Promise} - Промис с результатом отправки email
 */
const sendNewResponseNotification = async (publisherEmail, listingInfo, responderInfo, responseMessage) => {
  try {
    // Сообщение для отправки
    const mailOptions = {
      from: `"INEED.KZ" <${process.env.EMAIL_USER}>`,
      to: publisherEmail,
      subject: `Новый отклик на объявление "${listingInfo.title}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Получен новый отклик на ваше объявление</h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Информация об объявлении:</h3>
            <p><strong>Название:</strong> ${listingInfo.title}</p>
            <p><strong>ID объявления:</strong> ${listingInfo.id}</p>
          </div>
          
          <div style="background-color: #f0f7ff; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Информация о респонденте:</h3>
            <p><strong>Имя:</strong> ${responderInfo.name || 'Не указано'}</p>
            <p><strong>Компания:</strong> ${responderInfo.companyName || 'Не указано'}</p>
            ${responderInfo.email ? `<p><strong>Email:</strong> ${responderInfo.email}</p>` : ''}
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Текст отклика:</h3>
            <p style="white-space: pre-line;">${responseMessage}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/listings/${listingInfo.id}" 
              style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Просмотреть отклик
            </a>
          </div>
          
          <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">
            Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.
          </p>
        </div>
      `,
    };

    // Отправляем email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Отправка уведомления респонденту о принятии или отклонении его отклика
 * @param {string} responderEmail - Email автора отклика
 * @param {Object} listingInfo - Информация об объявлении
 * @param {boolean} isAccepted - Принят или отклонен отклик
 * @param {Object} publisherInfo - Информация о владельце объявления (опционально)
 * @returns {Promise} - Промис с результатом отправки email
 */
const sendResponseStatusNotification = async (responderEmail, listingInfo, isAccepted, publisherInfo = {}) => {
  try {
    // Определяем тему и содержимое в зависимости от статуса
    const subject = isAccepted 
      ? `Ваш отклик на объявление "${listingInfo.title}" принят` 
      : `Ваш отклик на объявление "${listingInfo.title}" отклонен`;
    
    // HTML для принятого отклика будет содержать контактную информацию
    let statusHtml = '';
    if (isAccepted) {
      statusHtml = `
        <div style="background-color: #e7f7e7; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #28a745;">Ваш отклик принят!</h3>
          <p>Поздравляем! Автор объявления заинтересовался вашим предложением и принял ваш отклик.</p>
          
          <div style="margin-top: 15px; border-top: 1px solid #c3e6cb; padding-top: 15px;">
            <h4 style="margin-top: 0;">Контактная информация автора объявления:</h4>
            <p><strong>Имя:</strong> ${publisherInfo.name || 'Не указано'}</p>
            ${publisherInfo.phoneNumber ? `<p><strong>Телефон:</strong> ${publisherInfo.phoneNumber}</p>` : ''}
            ${publisherInfo.email ? `<p><strong>Email:</strong> ${publisherInfo.email}</p>` : ''}
            ${publisherInfo.company?.name ? `<p><strong>Компания:</strong> ${publisherInfo.company.name}</p>` : ''}
          </div>
        </div>
      `;
    } else {
      statusHtml = `
        <div style="background-color: #fff3f3; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #dc3545;">Ваш отклик отклонен</h3>
          <p>К сожалению, автор объявления отклонил ваш отклик.</p>
          <p>Не расстраивайтесь, рекомендуем просмотреть другие актуальные объявления на нашей платформе.</p>
        </div>
      `;
    }
    
    // Сообщение для отправки
    const mailOptions = {
      from: `"INEED.KZ" <${process.env.EMAIL_USER}>`,
      to: responderEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Статус вашего отклика обновлен</h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Информация об объявлении:</h3>
            <p><strong>Название:</strong> ${listingInfo.title}</p>
            <p><strong>ID объявления:</strong> ${listingInfo.id}</p>
          </div>
          
          ${statusHtml}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/listings/${listingInfo.id}" 
              style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Перейти к объявлению
            </a>
          </div>
          
          <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">
            Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.
          </p>
        </div>
      `,
    };

    // Отправляем email
    const info = await transporter.sendMail(mailOptions);
    console.log('Status notification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNewResponseNotification,
  sendResponseStatusNotification,
};