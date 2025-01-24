// utils/avatar.js
export const generateGoogleStyleAvatar = (name) => {
    console.log('Generating avatar for:', name); // Отладочный вывод
  
    // Получаем первую букву имени
    const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';
  
    // Генерация цвета на основе хэша имени
    const colors = [
      '#FF6B6B', '#FFD166', '#45B8AC', '#4ECDC4', '#54C6EB',
      '#6A8EAE', '#A06CD5', '#D4A5A5', '#FF9F1C', '#2EC4B6'
    ];
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = colors[hash % colors.length];
  
    // Создаем SVG с первой буквой и цветным фоном
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${color}" rx="50" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="#FFF" text-anchor="middle" dy=".3em">
          ${firstLetter}
        </text>
      </svg>
    `;
  
    // Возвращаем SVG в формате Data URL
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };