
// // Contador para los ids de los enemigos
// let contadorEnemigos = 1;

// // Función para crear un enemigo en el área de juego
// function crearEnemigo() {
//     const gameArea = document.getElementById('game-area');

//     // Crear un nuevo elemento div para el enemigo
//     const enemigo = document.createElement('div');
//     // Agregar la clase `enemy`
//     enemigo.classList.add('enemy');
//     // Asignar un id único usando el contador
//     enemigo.id = 'enemy-' + contadorEnemigos;
//     contadorEnemigos++;

//     // Añadir el enemigo al área de juego
//     gameArea.appendChild(enemigo);
// }

// // Función para crear varios enemigos
// function crearEnemigos(cantidad) {
//     for (let i = 0; i < cantidad; i++) {
//         crearEnemigo();
//     }
// }

function Easy() {
    // Guardar configuración en localStorage
    localStorage.setItem('enemyCount', 5);        // 5 enemigos
    localStorage.setItem('enemyMoveInterval', 500);      // Velocidad de 500 ms
    window.location.href = 'index1.html';         // Redirigir a la página del juego
}

function Medium() {
    localStorage.setItem('enemyCount', 8);        // 8 enemigos
    localStorage.setItem('enemyMoveInterval', 400);      // Velocidad de 400 ms
    window.location.href = 'index1.html';         // Redirigir a la página del juego
}

function Hard() {
    localStorage.setItem('enemyCount', 12);       // 12 enemigos
    localStorage.setItem('enemyMoveInterval', 270);      // Velocidad de 300 ms
    window.location.href = 'index1.html';         // Redirigir a la página del juego
}


var menu_music = new Audio('/music/index music.wav');
menu_music.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
function musicToggle(){
    if (document.getElementById("check").checked){
        menu_music.play();
    }else{
        menu_music.pause();
    }
}
musicToggle()

//usar <marquee direction='up'></marquee>
//para que la lista de los puntos suba indefinidamente
