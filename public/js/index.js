let socket = io();
socket.on("reload", () => {
    location.reload();
})

socket.on("Timer", (time) => {
    timer(time)
})

let interval;

function startTimer(duration, display) {
    var timer = duration,
        minutes, seconds;
    interval = setInterval(function() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

function timer(time) {
    if (interval) {
        clearInterval(interval)
    }
    var fiveMinutes = 60 * time,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
};