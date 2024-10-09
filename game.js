document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const rows = 30;
    const cols = 50;
    const grid = [];
    let redX = 1; // Red starts at the upper left corner
    let redY = 1;
    const enemies = [];
    const keysPressed = {};
    const speed = 0.05; // Movement step for smooth movement
    let gameOver = false; // Indicator to check if the game has ended

    // Adjust cell size to fill the entire screen
    let cellWidth = Math.floor(window.innerWidth / cols);
    let cellHeight = Math.floor(window.innerHeight / rows);

    // Generate grid with walls and paths
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            grid[row][col] = 1; // 1 represents a wall
        }
    }

    // Depth-first search algorithm to generate maze
    const generateMaze = (x, y) => {
        const directions = [
            [-2, 0], [2, 0], [0, -2], [0, 2]
        ];
        shuffle(directions);
        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx > 0 && nx < rows && ny > 0 && ny < cols && grid[nx][ny] === 1) {
                grid[nx][ny] = 0;
                grid[x + dx / 2][y + dy / 2] = 0;
                generateMaze(nx, ny);
            }
        }
    };

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    grid[1][1] = 0;
    generateMaze(1, 1);

    // Add additional connections to make the maze more complex
    const addExtraConnections = () => {
        for (let row = 1; row < rows - 1; row++) {
            for (let col = 1; col < cols - 1; col++) {
                if (grid[row][col] === 1) {
                    const neighbors = [];
                    if (grid[row - 1][col] === 0) neighbors.push([row - 1, col]);
                    if (grid[row + 1][col] === 0) neighbors.push([row + 1, col]);
                    if (grid[row][col - 1] === 0) neighbors.push([row, col - 1]);
                    if (grid[row][col + 1] === 0) neighbors.push([row, col + 1]);

                    if (neighbors.length >= 2 && Math.random() > 0.5) {
                        grid[row][col] = 0;
                    }
                }
            }
        }
    };

    addExtraConnections();

    grid[rows - 2][cols - 2] = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = grid[row][col] === 1 ? 'cell wall' : 'cell path';
            cell.style.width = `${cellWidth}px`;
            cell.style.height = `${cellHeight}px`;
            cell.style.position = 'absolute';
            cell.style.left = `${col * cellWidth}px`;
            cell.style.top = `${row * cellHeight}px`;
            gameArea.appendChild(cell);
        }
    }

    const red = document.getElementById('red');
    red.style.width = `${cellWidth * 0.6}px`;
    red.style.height = `${cellHeight * 0.6}px`;
    red.style.left = `${redX * cellWidth + (cellWidth - red.offsetWidth) / 2}px`;
    red.style.top = `${redY * cellHeight + (cellHeight - red.offsetHeight) / 2}px`;

    const exit = document.getElementById('exit');
    exit.style.width = `${cellWidth * 0.6}px`;
    exit.style.height = `${cellHeight * 0.6}px`;
    exit.style.left = `${(cols - 2) * cellWidth + (cellWidth - exit.offsetWidth) / 2}px`;
    exit.style.top = `${(rows - 2) * cellHeight + (cellHeight - exit.offsetHeight) / 2}px`;

    document.querySelectorAll('.enemy').forEach((enemyElement) => {
        let enemyX, enemyY;
        do {
            enemyX = Math.floor(Math.random() * cols);
            enemyY = Math.floor(Math.random() * rows);
        } while (grid[enemyY][enemyX] !== 0 || (enemyX === redX && enemyY === redY));

        enemyElement.style.width = `${cellWidth * 0.6}px`;
        enemyElement.style.height = `${cellHeight * 0.6}px`;
        enemyElement.style.position = 'absolute';
        enemyElement.style.left = `${enemyX * cellWidth + (cellWidth - enemyElement.offsetWidth) / 2}px`;
        enemyElement.style.top = `${enemyY * cellHeight + (cellHeight - enemyElement.offsetHeight) / 2}px`;
        enemies.push({ element: enemyElement, x: enemyX, y: enemyY });
    });

    document.addEventListener('keydown', (event) => {
        if (!gameOver) keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        if (!gameOver) keysPressed[event.key] = false;
    });

    const moveRed = () => {
        let dx = 0, dy = 0;

        if (keysPressed['ArrowLeft'] || keysPressed['a']) {
            dx = -speed;
        } else if (keysPressed['ArrowRight'] || keysPressed['d']) {
            dx = speed;
        }
        if (keysPressed['ArrowUp'] || keysPressed['w']) {
            dy = -speed;
        } else if (keysPressed['ArrowDown'] || keysPressed['s']) {
            dy = speed;
        }

        const nextX = redX + dx;
        const nextY = redY + dy;

        if (
            nextX >= 0 && nextX < cols &&
            nextY >= 0 && nextY < rows &&
            grid[Math.round(nextY)][Math.round(nextX)] === 0
        ) {
            redX = nextX;
            redY = nextY;
            red.style.left = `${redX * cellWidth + (cellWidth - red.offsetWidth) / 2}px`;
            red.style.top = `${redY * cellHeight + (cellHeight - red.offsetHeight) / 2}px`;
        }

        if (Math.round(redX) === cols - 2 && Math.round(redY) === rows - 2) {
            alert('You have found the exit!');
        }
    };

    const moveEnemies = () => {
        enemies.forEach((enemy) => {
            if (gameOver) return;

            let bestMove = null;
            let shortestDistance = Infinity;

            const directions = [
                [speed, 0], [-speed, 0], [0, speed], [0, -speed]
            ];

            directions.forEach(([dx, dy]) => {
                const newX = enemy.x + dx;
                const newY = enemy.y + dy;

                if (
                    newX >= 0 && newX < cols &&
                    newY >= 0 && newY < rows &&
                    grid[Math.round(newY)][Math.round(newX)] === 0
                ) {
                    const distance = Math.abs(newX - redX) + Math.abs(newY - redY);
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        bestMove = [newX, newY];
                    }
                }
            });

            if (bestMove) {
                const [nextX, nextY] = bestMove;
                enemy.x = nextX;
                enemy.y = nextY;
                enemy.element.style.left = `${nextX * cellWidth + (cellWidth - enemy.element.offsetWidth) / 2}px`;
                enemy.element.style.top = `${nextY * cellHeight + (cellHeight - enemy.element.offsetHeight) / 2}px`;
            }

            if (Math.round(enemy.x) === Math.round(redX) && Math.round(enemy.y) === Math.round(redY) && !gameOver) {
                gameOver = true; // Set gameOver to true to stop further actions

                // Show the Game Over message
                const gameOverScreen = document.getElementById('game-over');
                gameOverScreen.classList.remove('hidden');

                // Handle the buttons to restart or exit the game
                document.getElementById('restart-button').onclick = () => {
                    gameOverScreen.classList.add('hidden'); // Hide game over screen before reload
                    window.location.reload(); // Reload the game when clicking "Restart Game"
                };

                document.getElementById('exit-button').onclick = () => {
                    // Hide the game area and the Game Over message
                    gameArea.style.display = 'none';
                    gameOverScreen.style.display = 'none';

                    // Show a farewell message
                    const exitMessage = document.createElement('div');
                    exitMessage.innerHTML = "<h1>Thanks for playing</h1>";
                    exitMessage.style.color = 'white';
                    exitMessage.style.textAlign = 'center';
                    document.body.appendChild(exitMessage);
                };
            }
        });
    };

    const gameLoop = () => {
        if (!gameOver) {
            moveRed();
            moveEnemies();
        }
        requestAnimationFrame(gameLoop);
    };

    gameLoop(); // Start the game loop
});
