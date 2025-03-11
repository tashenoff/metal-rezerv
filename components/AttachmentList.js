import { useState } from 'react';

const AttachmentList = ({ attachments, canDelete, onDelete, token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Функция для определения иконки по типу файла
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('word')) {
      return '📝';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return '📊';
    } else if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('compressed')) {
      return '📦';
    } else {
      return '📎';
    }
  };

  // Форматирование размера файла
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Обработчик удаления файла
  const handleDeleteFile = async (attachmentId) => {
    if (!canDelete) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Delete error response:', data);
        throw new Error(data.error || data.details || 'Ошибка при удалении файла');
      }
      
      if (onDelete && typeof onDelete === 'function') {
        onDelete(attachmentId);
      }
    } catch (error) {
      console.error('Delete attachment error:', error);
      setError(error.message || 'Ошибка при удалении файла');
    } finally {
      setLoading(false);
    }
  };

  // Проверка, является ли файл изображением
  const isImage = (fileType) => fileType.startsWith('image/');

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded border text-center text-gray-500">
        Нет прикрепленных файлов
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Прикрепленные файлы</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="p-3 bg-gray-50 rounded border flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getFileIcon(attachment.fileType)}</span>
              <div>
                <a 
                  href={attachment.filePath} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {attachment.fileName}
                </a>
                <div className="text-xs text-gray-500">
                  {formatBytes(attachment.fileSize)} • Загружен {formatDate(attachment.uploadedAt)}
                </div>
              </div>
            </div>
            
            {canDelete && (
              <button
                onClick={() => handleDeleteFile(attachment.id)}
                disabled={loading}
                className="text-red-600 hover:text-red-800 ml-3"
                title="Удалить файл"
              >
                {loading ? '⏳' : '🗑️'}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Предпросмотр изображений */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {attachments.filter(att => isImage(att.fileType)).map((attachment) => (
          <div key={`img-${attachment.id}`} className="border rounded overflow-hidden">
            <a href={attachment.filePath} target="_blank" rel="noopener noreferrer">
              <img 
                src={attachment.filePath} 
                alt={attachment.fileName} 
                className="w-full h-40 object-cover"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentList;