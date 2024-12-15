const WIDTH = 1440;
const HEIGHT = WIDTH * 2 / 3;

const canvas = document.querySelector("canvas");
const audio = document.querySelector("audio");
const playPauseButton = document.querySelector(".control-button");
const audioTrackBar = document.querySelector("#audio-tracker-bar span");

canvas.width = WIDTH;
canvas.height = HEIGHT;
const canvasCtx = canvas.getContext("2d");

let firstClick = true;
playPauseButton.addEventListener("click", (e) => {
    if (firstClick) {
        initialize();
        audio.play();
        firstClick = false;
    }
    
    e.currentTarget.classList.toggle("playing");
    if (e.currentTarget.classList.contains("playing")) audio.pause()
    else audio.play()
})

function initialize() {    
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination)

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    setInterval(() =>  {
        let duration = audio.duration
        let currentTime = audio.currentTime
        let percent = currentTime / duration * 100
        audioTrackBar.style.width = `${percent.toFixed(2)}%`
    }, 250)

    function draw() {
        requestAnimationFrame(draw)

        analyser.getByteFrequencyData(dataArray)

        const gradient = canvasCtx.createLinearGradient(0, 0, WIDTH, HEIGHT);
        gradient.addColorStop(0, "#673ab7");
        gradient.addColorStop(1, "#512da8");
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLength) * 3;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight =  Math.pow(dataArray[i] / 16, 2);
            canvasCtx.fillStyle = `rgb(215 255 255)`;
            canvasCtx.fillRect(x, (HEIGHT / 2 ) - barHeight, barWidth, barHeight * 2);
            x += barWidth + 15;
        }
    }

    draw();
}