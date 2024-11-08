function goGame(){
    window.location.href = 'index1.html';
}
var menu_music = new Audio('index music.wav');
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
//usar <marquee direction='up'></marquee>
//para que la lista de los puntos suba indefinidamente