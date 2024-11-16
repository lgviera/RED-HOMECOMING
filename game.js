
// BLOQUE 1
// Esta sección inicializa la música de fondo para que se repita continuamente.
// Además, la función musicToggle permite alternar la reproducción de la música dependiendo del estado de un checkbox.

// Inicializa el audio de fondo.
var game_music = new Audio('game music rave.wav');
game_music.addEventListener('ended', function() {
    this.currentTime = 0;   // Reinicia la música cuando termina.
    this.play();            // Reproduce la música nuevamente.
}, false);
function musicToggle(){
    // Controla si la música está activada o desactivada.
    if (document.getElementById("check").checked){
        game_music.play();
    }else{
        game_music.pause();
    }
}
// FIN BLOQUE 1

// BLOQUE 2
// Aquí, se leen los datos almacenados en `localStorage` para obtener el número de enemigos (enemyCount).
// La función `crearEnemigos` crea estos enemigos y los agrega al área de juego.
// Esto es para crear enemigos y modificar velocidad segun dificultad elegida.

// Leer valores guardados en localStorage
const enemyCount = parseInt(localStorage.getItem('enemyCount'));


// Función para crear enemigos en el área de juego
function crearEnemigos(cantidad) {
    const gameArea = document.getElementById('game-area');  // Selecciona el área de juego.
    for (let i = 0; i < cantidad; i++) {
        const enemigo = document.createElement('div');      // Crea un elemento div para el enemigo.
        enemigo.classList.add('enemy');                     // Asigna la clase 'enemy'.
        enemigo.id = 'enemy-' + (i + 1);                    // Asigna un ID único a cada enemigo.
        gameArea.appendChild(enemigo);                      // Agrega el enemigo al área de juego.
    }
}

// Llamar a la función para crear los enemigos al cargar la página
crearEnemigos(enemyCount);
// FIN BLOQUE 2

// BLOQUE 3
// Este bloque define variables clave para el área de juego y el estado inicial del jugador y enemigos.

document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const rows = 31; // filas de la matriz
    const cols = 51; // columnas de la matriz
    const grid = []; // matriz (mapa del juego)
    let redX = 1, redY = 1; // Posición inicial de Red.
    const enemies = []; // arreglo para los enemigos
    const keysPressed = {}; // variable donde se guardan las teclas que el usuario tipea
    const speedRed = 0.05 // Velocidad de Red. ( Distancia de un paso en el movimiento de Red )
    let gameOver = false; // Indicador de fin del juego.

    // Esto calcula el tamaño de cada celda del laberinto para ajustarse a la pantalla.
    let cellWidth = Math.floor(window.innerWidth / cols);
    let cellHeight = Math.floor(window.innerHeight / rows);

    // Este `for` inicializa la cuadrícula del laberinto, representando cada celda grid[x][y] como pared si grid[x][y] == 1
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            grid[row][col] = 1; // 1 representa una pared.
        }
    }
// FIN BLOQUE 3

// BLOQUE 4: GENERACION DEL LABERINTO CON DFS
// ALGORITMO DFS(DEPTH FIRST SEARCH) PARA GENERAR EL LABERINTO.
// El algoritmo DFS(BUSQUEDA EN PROFUNDIDAD) funciona de la siguiente manera:
// 1. Comienza en un nodo raíz. En el caso de un grafo, se puede utilizar cualquier nodo aleatorio. 
// 2. Examina cada rama lo más lejos posible antes de retroceder. 
// 3. Marca los nodos como visitados y explora recursivamente los vecinos no visitados. 
// 4. El proceso continúa hasta que todos los vértices alcanzables desde el vértice fuente original han sido descubiertos.

    // Este código utiliza DFS para crear un laberinto. `generateMaze` explora las celdas no visitadas y establece caminos en la cuadrícula.
    const generateMaze = (x, y) => {
        const directions = [
            [-2, 0], [2, 0], [0, -2], [0, 2]
        ];
        shuffle(directions); // Mezcla las direcciones.
        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx > 0 && nx < rows && ny > 0 && ny < cols && grid[nx][ny] === 1) {
                grid[nx][ny] = 0;                       // Marca el camino en la cuadrícula.
                grid[x + dx / 2][y + dy / 2] = 0;       // Marca la conexión intermedia.
                generateMaze(nx, ny);                   // Llama recursivamente para generar el laberinto.
            }
        }
    };
    // La función `shuffle` mezcla las direcciones aleatoriamente, ayudando a que el laberinto sea único en cada partida.
    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Inicializa la generación del laberinto desde la posición (1,1).
    grid[1][1] = 0;
    generateMaze(1, 1);

    // La función `addExtraConnections` agrega conexiones adicionales al laberinto, haciéndolo menos lineal y más complejo.
    // Para cada celda de la cuadrícula que es una pared (grid[row][col] === 1),
    // se verifica si tiene al menos dos celdas vecinas que sean caminos (grid[row][col] === 0).
    // Si encuentra al menos dos caminos adyacentes y pasa una verificación de probabilidad (50%),
    // convierte la celda actual en un camino (grid[row][col] = 0), creando así una conexión extra en el laberinto.
    const addExtraConnections = () => {
        for (let row = 1; row < rows - 1; row++) {
            for (let col = 1; col < cols - 1; col++) {
                if (grid[row][col] === 1) { // // Solo se consideran las celdas que son paredes.
                    const neighbors = [];
                    if (grid[row - 1][col] === 0) neighbors.push([row - 1, col]);   // Vecino arriba.
                    if (grid[row + 1][col] === 0) neighbors.push([row + 1, col]);   // Vecino abajo.
                    if (grid[row][col - 1] === 0) neighbors.push([row, col - 1]);   // Vecino a la izquierda.
                    if (grid[row][col + 1] === 0) neighbors.push([row, col + 1]);   // Vecino a la derecha.

                    // Si hay al menos dos caminos cercanos y una probabilidad de 50%, convierte la celda en un camino.
                    if (neighbors.length >= 2 && Math.random() > 0.5) {
                        grid[row][col] = 0;
                    }
                }
            }
        }
    };

    addExtraConnections();

    // Esta línea asegura que la celda en la esquina inferior derecha del laberinto sea un camino, que se utilizará como la salida del laberinto.
    grid[rows - 2][cols - 2] = 0;

    // CREACION DE LA PARTE VISUAL DEL JUEGO CON HTML Y CSS DESDE JAVASCRIPT:
    // Este sub-bloque crea los elementos visuales para cada celda en el área de juego (gameArea).
    // Para cada celda en grid, crea un elemento div que representa la celda en el laberinto.
    // Si el valor de la celda es 1 (pared), la clase es cell wall, y si es 0 (camino), la clase es cell path.
    // Las dimensiones (width y height) y posición (left y top) de cada celda se ajustan según el tamaño calculado para llenar toda el área visible.
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

    // POSICIONAMIENTO DE RED:
    // Aquí se ajusta el tamaño y posición inicial del personaje Red en el área de juego.
    // Red ocupa la mitad del tamaño de una celda (cellWidth * 0.5, cellHeight * 0.5), y su posición inicial se CENTRA en (redX, redY).
    const red = document.getElementById('red');
    red.style.width = `${cellWidth * 0.5}px`;
    red.style.height = `${cellHeight * 0.5}px`;
    red.style.left = `${redX * cellWidth + (cellWidth - red.offsetWidth) / 2}px`;
    red.style.top = `${redY * cellHeight + (cellHeight - red.offsetHeight) / 2}px`;

    // POSICIONAMIENTO DE LA SALIDA:
    // La salida del laberinto (exit) también se ajusta para tener la mitad del tamaño de una celda
    // y se coloca en la esquina inferior derecha del área de juego.
    const exit = document.getElementById('exit');
    exit.style.width = `${cellWidth * 0.5}px`;
    exit.style.height = `${cellHeight * 0.5}px`;
    exit.style.left = `${(cols - 2) * cellWidth + (cellWidth - exit.offsetWidth) / 2}px`;
    exit.style.top = `${(rows - 2) * cellHeight + (cellHeight - exit.offsetHeight) / 2}px`;

    // POSICIONAMIENTO INICIAL DE LOS ENEMIGOS
    // Para cada enemigo (elemento con la clase enemy), se selecciona una posición inicial aleatoria (enemyX, enemyY)
    // que sea un camino (grid[enemyY][enemyX] === 0) y que no esté ocupada por Red.
    // La posición y el tamaño visual de cada enemigo se ajustan y se almacenan en el arreglo `enemies`.
    document.querySelectorAll('.enemy').forEach((enemyElement) => {
        let enemyX, enemyY;
        do {
            enemyX = Math.floor(Math.random() * cols);
            enemyY = Math.floor(Math.random() * rows);
        } while (grid[enemyY][enemyX] !== 0 || (enemyX === redX && enemyY === redY));

        enemyElement.style.width = `${cellWidth}px`;
        enemyElement.style.height = `${cellHeight}px`;
        enemyElement.style.position = 'absolute';
        enemyElement.style.left = `${enemyX * cellWidth + (cellWidth - enemyElement.offsetWidth) / 2}px`;
        enemyElement.style.top = `${enemyY * cellHeight + (cellHeight - enemyElement.offsetHeight) / 2}px`;
        enemies.push({ element: enemyElement, x: enemyX, y: enemyY });
    });
// FIN BLOQUE 4

// BLOQUE 5: MOVIMIENTO DE RED
// Este bloque permite que el jugador (representado por Red) se mueva en la cuadrícula usando las teclas de dirección.
// Verifica que el próximo movimiento sea un camino antes de actualizar la posición.

    // Estos event listeners detectan cuándo una tecla se presiona (keydown) o se suelta (keyup).
    // Actualizan el objeto keysPressed para reflejar el estado de las teclas y permitir que Red se mueva según las teclas que estén presionadas.
    document.addEventListener('keydown', (event) => {
        if (!gameOver) keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        if (!gameOver) keysPressed[event.key] = false;
    });

    const moveRed = () => {
        let dx = 0, dy = 0;

        if (keysPressed['ArrowLeft'] || keysPressed['a']) {
            dx = -speedRed;
        } else if (keysPressed['ArrowRight'] || keysPressed['d']) {
            dx = speedRed;
        }
        if (keysPressed['ArrowUp'] || keysPressed['w']) {
            dy = -speedRed;
        } else if (keysPressed['ArrowDown'] || keysPressed['s']) {
            dy = speedRed;
        }

        // Calcular la posición futura de Red en la cuadrícula
        const nextX = redX + dx;
        const nextY = redY + dy;

        // Convertir la posición futura a índices de la cuadrícula
        const gridX = Math.round(nextX);
        const gridY = Math.round(nextY);

         // Verificar que la posición futura esté dentro de los límites y sea un camino
        if (
            nextX >= 0 && nextX < cols &&
            nextY >= 0 && nextY < rows &&
            grid[gridY][gridX] === 0
        ) {  
            // Actualizar posición de Red si la celda siguiente es un camino.
            // Aclaracion: Las 2 primeras lineas es para actualizar el movimiento logico,
            //             las 2 ultimas para actualizar el movimiento grafico.        
            redX = nextX;
            redY = nextY;
            red.style.left = `${redX * cellWidth + (cellWidth - red.offsetWidth)/2}px`;
            red.style.top = `${redY * cellHeight + (cellHeight - red.offsetHeight)/2}px`;
        }
        // Verificar si RED llego a la salida
        if (Math.round(redX) === cols - 2 && Math.round(redY) === rows - 2) {
            alert("Has llegado al final");
            window.location.href = 'index.html';
        }
    };
// FIN BLOQUE 5

// BLOQUE 6: MOVIMIENTO DE ENEMIGOS CON A*
// ¿Qué es A*? Algoritmo de busqueda en grafos de tipo heuristico.
// 1. Implementación del Algoritmo A* (`aStarPathfinding`):
//      • Calcula el camino más corto desde la posición de un enemigo hasta la posición de Red.
//      • Utiliza listas `openList` y `closedList` para gestionar nodos pendientes y ya evaluados.
//      • Emplea la distancia de Manhattan como función heurística para estimar el costo restante.
// 2. Movimiento de Enemigos (`moveEnemies`):
//      • Controla el intervalo de tiempo entre movimientos de enemigos para evitar movimientos demasiado rápidos.
//      • Para cada enemigo:
//          - Calcula el camino hacia Red utilizando A*.
//          - Mueve al enemigo un paso hacia Red siguiendo el camino calculado.
//          - Actualiza la posición visual del enemigo en la pantalla.
//          - Verifica si el enemigo ha alcanzado a Red, lo que termina el juego.


//  Funcion `aStarPathfinding`:
//      Parámetros:
//          start: Objeto que representa la posición inicial con propiedades x e y.
//          goal: Objeto que representa la posición objetivo con propiedades x e y.
//          grid: Matriz bidimensional que representa el mapa o laberinto donde 0 indica un camino accesible y 1 una pared.
//  Variables cols y rows:
//      Determinan el número de columnas y filas de la cuadrícula (grid), respectivamente.
const aStarPathfinding = (start, goal, grid) => {
    const cols = grid[0].length;
    const rows = grid.length;

//  Funcion `heuristic`:
//  Calcula la distancia de Manhattan entre dos puntos (x1, y1) y (x2, y2).
//  La distancia de Manhattan es la suma de las diferencias absolutas de sus coordenadas correspondientes,
//  útil para movimientos en una cuadrícula donde solo se permite moverse en direcciones cardinales (arriba, abajo, izquierda, derecha).
    const heuristic = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

//  Lista `openList`:
//      Es una lista de nodos que están pendientes de ser evaluados.
//      Inicialmente contiene solo el nodo de inicio con:
//          x e y: Coordenadas del nodo.
//          g: Costo desde el nodo inicial hasta el nodo actual (0 al inicio).
//          h: Valor heurístico calculado mediante la función heuristic.
//          parent: Referencia al nodo anterior en el camino (inicialmente null).
//  Lista `closedList`:
//      Es una lista de nodos que ya han sido evaluados y cerrados.
//      Inicialmente está vacía.
    const openList = [{ x: start.x, y: start.y, g: 0, h: heuristic(start.x, start.y, goal.x, goal.y), parent: null }];
    const closedList = [];

    while (openList.length > 0) {
        openList.sort((a, b) => (a.g + a.h) - (b.g + b.h));
        const currentNode = openList.shift();

        // Si llegamos al objetivo, construimos el camino
        if (currentNode.x === goal.x && currentNode.y === goal.y) {
            const path = [];
            let temp = currentNode;
            while (temp) {
                path.push([temp.x, temp.y]);
                temp = temp.parent;
            }
            return path.reverse();
        }

        // Marcamos el nodo actual como visitado
        closedList.push(currentNode);

        // Definimos las direcciones de movimiento posibles
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0]
        ];

        directions.forEach(([dx, dy]) => {
            const newX = currentNode.x + dx;
            const newY = currentNode.y + dy;

//  Verificamos que la nueva posición esté dentro del límite y sea accesible
            if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && grid[newY][newX] === 0) {
//  Utiliza el método some para comprobar si la nueva posición ya ha sido evaluada y está en closedList.
//  Si es así, se ignora este nodo y se continúa con la siguiente dirección
// (return dentro de forEach solo salta a la siguiente iteración).
                if (closedList.some(node => node.x === newX && node.y === newY)) return;

// Si la nueva posicion no esta en `closedList` entonces no ha sido evaluada.
// Calculamos los costes g, h y f de la nueva posicion.
                const g = currentNode.g + 1; // coste del movimiento
                const h = heuristic(newX, newY, goal.x, goal.y);
                const existingNode = openList.find(node => node.x === newX && node.y === newY);

//  Nuevo Nodo:
//      Si la nueva posición no está en la openList, se crea un nuevo objeto nodo
//      con las propiedades x, y, g, h y parent, y se añade a la openList para su posterior evaluación.
//  Nodo Existente:
//      Si la nueva posición ya está en la openList y el nuevo costo g es menor que el costo previamente almacenado (existingNode.g),
//      se actualiza el nodo existente con el nuevo costo g y se establece el parent al nodo actual (currentNode).
//      Esto indica que se ha encontrado una ruta más eficiente hacia este nodo.
                if (!existingNode) {
                    openList.push({ x: newX, y: newY, g, h, parent: currentNode });
                } else if (g < existingNode.g) {
                    existingNode.g = g;
                    existingNode.parent = currentNode;
                }
            }
        });
    }

    // Si no encontramos un camino, devolvemos null
    return null;
};
//  Fin algoritmo A* (funcion `aStarPathFinding`)

//  SUB-BLOQUE: Movimiento de enemigos

//  Se obtiene el valor almacenado en localStorage bajo la clave 'enemyMoveInterval'
const enemyMoveInterval = parseInt(localStorage.getItem('enemyMoveInterval'));
//  `lastEnemyMoveTime` almacena la última vez (en milisegundos) que los enemigos se movieron.
let lastEnemyMoveTime = 0;

// Funcion `moveEnemies`:
//      Parametro `currentTime`: Tiempo actual proporcionado por requestAnimationFrame
//  Control de Intervalo de Movimiento:
//      Verifica si ha pasado suficiente tiempo desde el último movimiento de los enemigos comparando currentTime con lastEnemyMoveTime.
//      Si no ha pasado el enemyMoveInterval requerido, la función retorna sin hacer nada (return).
//      Si ha pasado el intervalo, actualiza lastEnemyMoveTime con el currentTime actual.
const moveEnemies = (currentTime) => {
    if (currentTime - lastEnemyMoveTime < enemyMoveInterval) return;
    lastEnemyMoveTime = currentTime;
// Iteración sobre Enemigos: Se recorre cada enemigo en el arreglo enemies.
    enemies.forEach((enemy) => {
// Condición de Fin de Juego: Si la variable gameOver es true, la función retorna inmediatamente, evitando movimientos adicionales.
        if (gameOver) return;

// Cálculo del Camino:
//      Para cada enemigo, se llama a la función aStarPathfinding para encontrar el camino más corto hacia Red.
// Parámetros:
//      start: Posición actual del enemigo, redondeada a los enteros más cercanos usando Math.round para alinearse con la cuadrícula.
//      goal: Posición actual de Red, también redondeada.
//      grid: La cuadrícula del laberinto previamente definida.
        const path = aStarPathfinding({ x: Math.round(enemy.x), y: Math.round(enemy.y) },
                                      { x: Math.round(redX), y: Math.round(redY) },
                                      grid);
// Resultado:
//      path es un arreglo de coordenadas que representan el camino desde el enemigo hasta Red.
        if (path && path.length > 1) {
            const [nextX, nextY] = path[1]; 

            enemy.x = nextX;
            enemy.y = nextY;

            enemy.element.style.left = `${enemy.x * cellWidth + (cellWidth - enemy.element.offsetWidth) / 2}px`;
            enemy.element.style.top = `${enemy.y * cellHeight + (cellHeight - enemy.element.offsetHeight) / 2}px`;
        }

        if (Math.round(enemy.x) === Math.round(redX) && Math.round(enemy.y) === Math.round(redY) && !gameOver) {
            gameOver = true;
            alert("Has Perdido!");
            window.location.href = 'index.html';
        }
    });
};
// FIN BLOQUE 6

// ULTIMO BLOQUE: BUCLE PRINCIPAL DEL JUEGO
// El bucle principal actualiza el movimiento de Red y los enemigos y sigue ejecutándose hasta que el juego termina.
const gameLoop = (time) => {
    moveRed(); // Allow Red to move freely
    moveEnemies(time); // Move enemies at controlled intervals

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
};

// Start the game loop
requestAnimationFrame(gameLoop);
})
