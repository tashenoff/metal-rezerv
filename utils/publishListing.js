const handlePublish = async (listingId) => {
    try {
      const response = await fetch('/api/publisher/publishListing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });
  
      if (response.ok) {
        const updatedListing = await response.json();
        return updatedListing; // Возвращаем обновленное объявление
      } else {
        throw new Error('Ошибка при публикации объявления.');
      }
    } catch (err) {
      throw new Error('Ошибка при публикации объявления.');
    }
  };
  
  export default handlePublish;
  