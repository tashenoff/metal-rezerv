import { useState } from 'react';

const FileUploader = ({ onUpload, listingId, token }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const allowedTypes = [
    'application/pdf',                     // PDF
    'application/msword',                  // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'image/jpeg',                          // JPEG, JPG
    'image/png',                           // PNG
    'application/vnd.ms-excel',            // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/zip',                     // ZIP
    'application/x-rar-compressed',        // RAR
  ];

  const maxSize = 10 * 1024 * 1024; // 10 МБ

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess('');
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Проверка типа файла
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Недопустимый тип файла. Разрешены PDF, DOC, DOCX, JPG, PNG, XLS, XLSX, ZIP, RAR.');
      setFile(null);
      return;
    }
    
    // Проверка размера файла
    if (selectedFile.size > maxSize) {
      setError(`Размер файла превышает максимально допустимый (10 МБ).`);
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Выберите файл для загрузки.');
      return;
    }
    
    if (!listingId) {
      setError('ID объявления не указан.');
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      console.log('Listing ID:', listingId);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('listingId', String(listingId));
      
      // Проверка formData
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', typeof value === 'object' ? 'File object' : value);
      }
      
      // Используем альтернативный API эндпоинт для загрузки
      const response = await fetch('/api/upload/simple', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при загрузке файла.');
      }
      
      setSuccess('Файл успешно загружен!');
      setFile(null);
      
      // Очищаем поле ввода файла
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
      
      if (onUpload && typeof onUpload === 'function') {
        onUpload(data.attachment);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded border">
      <h3 className="text-lg font-semibold mb-2">Загрузка файлов</h3>
      <p className="text-sm text-gray-600 mb-3">
        Разрешенные форматы: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX, ZIP, RAR.
        Максимальный размер файла: 10 МБ.
      </p>
      
      <div className="flex items-center space-x-3">
        <label className="flex-1">
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-4 py-2 rounded text-white ${!file || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </div>
      
      {file && (
        <div className="mt-2 p-2 bg-blue-50 rounded">
          <p className="text-sm">
            <span className="font-semibold">Выбран файл:</span> {file.name} ({formatBytes(file.size)})
          </p>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-2 p-2 bg-green-50 text-green-700 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default FileUploader;