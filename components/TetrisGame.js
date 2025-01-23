import { useState, useEffect, useCallback } from 'react';

const TetrisGame = () => {
  const [board, setBoard] = useState(Array(20).fill(Array(10).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Состояние для начала игры
  const [isPaused, setIsPaused] = useState(false); // Состояние паузы
  const [score, setScore] = useState(0); // Счёт
  const [highScore, setHighScore] = useState(0); // Рекорд
  const [level, setLevel] = useState(1); // Уровень сложности

  // Фигуры тетромино
  const pieces = [
    [[1, 1, 1, 1]], // I
    [
      [1, 1],
      [1, 1],
    ], // O
    [
      [0, 1, 0],
      [1, 1, 1],
    ], // T
    [
      [1, 0, 0],
      [1, 1, 1],
    ], // L
    [
      [0, 0, 1],
      [1, 1, 1],
    ], // J
    [
      [0, 1, 1],
      [1, 1, 0],
    ], // S
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // Z
  ];

  // Генерация случайной фигуры
  const getRandomPiece = () => {
    const randomIndex = Math.floor(Math.random() * pieces.length);
    return pieces[randomIndex];
  };

  // Проверка столкновений
  const checkCollision = (piece, x, y) => {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (
          piece[row][col] &&
          (board[y + row] && board[y + row][x + col]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // Движение фигуры вниз
  const moveDown = () => {
    if (gameOver || !isPlaying || isPaused) return;

    const newY = position.y + 1;
    if (!checkCollision(currentPiece, position.x, newY)) {
      setPosition({ ...position, y: newY });
    } else {
      // Фиксируем фигуру на поле
      const newBoard = board.map((row) => [...row]);
      for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
          if (currentPiece[row][col]) {
            newBoard[position.y + row][position.x + col] = 1;
          }
        }
      }
      setBoard(newBoard);

      // Проверяем заполненные линии
      clearLines(newBoard);

      // Генерация новой фигуры
      const newPiece = getRandomPiece();
      setCurrentPiece(newPiece);
      setPosition({ x: 4, y: 0 });

      // Проверка на завершение игры
      if (checkCollision(newPiece, 4, 0)) {
        setGameOver(true);
        setIsPlaying(false);
        updateHighScore();
      }
    }
  };

  // Очистка заполненных линий
  const clearLines = (board) => {
    const newBoard = board.filter((row) => row.some((cell) => cell === 0));
    const linesCleared = board.length - newBoard.length;
    if (linesCleared > 0) {
      const emptyRows = Array(linesCleared).fill(Array(10).fill(0));
      setBoard([...emptyRows, ...newBoard]);
      setScore((prevScore) => prevScore + linesCleared * 100); // Увеличиваем счёт
      updateLevel(linesCleared); // Увеличиваем уровень сложности
    }
  };

  // Увеличение уровня сложности
  const updateLevel = (linesCleared) => {
    const newLevel = Math.floor(score / 1000) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  };

  // Поворот фигуры
  const rotatePiece = (piece) => {
    const N = piece.length;
    const rotatedPiece = Array.from({ length: piece[0].length }, () =>
      Array(N).fill(0)
    );

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        rotatedPiece[j][N - 1 - i] = piece[i][j];
      }
    }

    return rotatedPiece;
  };

  // Обработка нажатий клавиш
  const handleKeyDown = useCallback(
    (e) => {
      if (gameOver || !isPlaying || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (!checkCollision(currentPiece, position.x - 1, position.y)) {
            setPosition({ ...position, x: position.x - 1 });
          }
          break;
        case 'ArrowRight':
          if (!checkCollision(currentPiece, position.x + 1, position.y)) {
            setPosition({ ...position, x: position.x + 1 });
          }
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp': // Поворот фигуры
          const rotatedPiece = rotatePiece(currentPiece);
          if (!checkCollision(rotatedPiece, position.x, position.y)) {
            setCurrentPiece(rotatedPiece);
          }
          break;
        case 'p': // Пауза по клавише "P"
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    },
    [currentPiece, position, gameOver, isPlaying, isPaused]
  );

  // Инициализация игры
  useEffect(() => {
    if (isPlaying) {
      const newPiece = getRandomPiece();
      setCurrentPiece(newPiece);
      setPosition({ x: 4, y: 0 });
      setGameOver(false);
      setScore(0);
      setLevel(1);
    }
  }, [isPlaying]);

  // Обработка нажатий клавиш
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Автоматическое движение вниз
  useEffect(() => {
    let interval;
    if (isPlaying && !gameOver && !isPaused) {
      interval = setInterval(moveDown, 1000 / level); // Скорость зависит от уровня
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, isPaused, level, moveDown]);

  // Загрузка рекорда из localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('tetrisHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Обновление рекорда
  const updateHighScore = () => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetrisHighScore', score.toString()); // Сохраняем в localStorage
    }
  };

  // Отрисовка игрового поля
  const drawBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    if (currentPiece) {
      for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
          if (currentPiece[row][col]) {
            displayBoard[position.y + row][position.x + col] = 1;
          }
        }
      }
    }

    return displayBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className={`w-5 h-5 ${cell ? 'bg-blue-500' : 'bg-gray-800/50'} border border-gray-700`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead)', // Фоновая картинка из интернета
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-black/70 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Tetris
        </h1>
        {!isPlaying ? (
          <div className="text-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg text-xl hover:bg-blue-600 transition"
            >
              Play
            </button>
            <p className="text-white mt-6 text-lg">High Score: {highScore}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-gray-800/70 p-4 rounded-lg shadow-lg">
              {drawBoard()}
            </div>
            <div className="mt-6 text-white text-center">
              <p className="text-xl">Score: {score}</p>
              <p className="text-xl">High Score: {highScore}</p>
              <p className="text-xl">Level: {level}</p>
            </div>
            {gameOver && (
              <div className="mt-6 text-red-500 text-2xl">Game Over!</div>
            )}
            {isPaused && (
              <div className="mt-6 text-yellow-500 text-2xl">Paused</div>
            )}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-yellow-600 transition"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisGame;