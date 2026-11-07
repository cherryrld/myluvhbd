const micBtn = document.getElementById("micBtn");
const manualBtn = document.getElementById("manualBtn");
const micStatus = document.getElementById("micStatus");

const flames = document.querySelectorAll(".flame");
const wish = document.getElementById("wish");
const fireworks = document.getElementById("fireworks");

let blown = false;
let stream = null;
let audioContext = null;
let animationId = null;


// FIREWORKS

function launchFireworks() {

    const colors = [
        "#8ecdf5",
        "#ffffff",
        "#ffd76a",
        "#a9bfff",
        "#b8e8ff"
    ];

    const positions = [
        [25, 30],
        [75, 30],
        [50, 20],
        [35, 60],
        [70, 60]
    ];

    positions.forEach(([x, y], index) => {

        setTimeout(() => {

            for (let i = 0; i < 24; i++) {

                const spark = document.createElement("div");

                spark.className = "firework-spark";

                const angle = (i / 24) * Math.PI * 2;
                const distance = 50 + Math.random() * 65;

                spark.style.left = x + "%";
                spark.style.top = y + "%";

                spark.style.setProperty(
                    "--dx",
                    Math.cos(angle) * distance + "px"
                );

                spark.style.setProperty(
                    "--dy",
                    Math.sin(angle) * distance + "px"
                );

                spark.style.background =
                    colors[Math.floor(Math.random() * colors.length)];

                fireworks.appendChild(spark);

                setTimeout(() => spark.remove(), 1200);

            }

        }, index * 250);

    });

}


// BLOW THE CANDLES

function blowCandles() {

    if (blown) return;

    blown = true;

    flames.forEach(flame => {
        flame.classList.add("out");
    });

    launchFireworks();

    wish.classList.remove("hidden");

    micStatus.textContent =
        "Your wish is on its way! 🩵";

    micBtn.textContent = "Candles Blown! ✨";
    micBtn.disabled = true;

    manualBtn.style.display = "none";
const birthdaySong = document.getElementById("birthdaySong");

birthdaySong.currentTime = 0;
birthdaySong.play();

    stopMicrophone();
}


// STOP MICROPHONE

function stopMicrophone() {

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }

}

// MICROPHONE DETECTION

micBtn.addEventListener("click", async () => {

    if (blown) return;

    try {

        micStatus.textContent = "Requesting microphone access...";

        stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        });

        if (blown) {
            stopMicrophone();
            return;
        }

        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();

        await audioContext.resume();

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 2048;
        source.connect(analyser);

        const data = new Uint8Array(analyser.fftSize);

        micStatus.textContent =
            "Microphone is listening! Clap, shout, or blow! 🎤";

        let loudStart = null;

        function detectSound() {

            if (blown) return;

            analyser.getByteTimeDomainData(data);

            let sum = 0;

            for (let i = 0; i < data.length; i++) {
                const value = (data[i] - 128) / 128;
                sum += value * value;
            }

            const volume = Math.sqrt(sum / data.length);

if (volume > 0.13) {
    if (loudStart === null) loudStart = Date.now();

    if (Date.now() - loudStart >= 250) {
        blowCandles();
        return;
    }
} else {
    loudStart = null;
}

            animationId = requestAnimationFrame(detectSound);
        }

        detectSound();

    } catch (error) {

        console.error("Microphone error:", error);

        micStatus.textContent =
            "Microphone unavailable. Allow access or use the button.";

        stopMicrophone();

    }

});

// MANUAL BUTTON

manualBtn.addEventListener("click", blowCandles);


// CLEANUP

window.addEventListener("pagehide", stopMicrophone); 
// CUSTOM MUSIC PLAYER

const birthdayAudio = document.getElementById("birthdayAudio");
const playBtn = document.getElementById("playBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const musicStatus = document.getElementById("playerMusicStatus");
const musicPlayer = document.querySelector(".music-player");

function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return minutes + ":" + String(seconds).padStart(2, "0");
}

playBtn.addEventListener("click", () => {
    if (birthdayAudio.paused) {
        birthdayAudio.play();
    } else {
        birthdayAudio.pause();
    }
});

birthdayAudio.addEventListener("play", () => {
    playBtn.textContent = "Ⅱ";
    musicStatus.textContent = "playing";
    musicPlayer.classList.add("playing");
});

birthdayAudio.addEventListener("pause", () => {
    playBtn.textContent = "▶";
    musicStatus.textContent = "paused";
    musicPlayer.classList.remove("playing");
});

birthdayAudio.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(birthdayAudio.duration);
});

birthdayAudio.addEventListener("timeupdate", () => {
    currentTimeDisplay.textContent = formatTime(birthdayAudio.currentTime);

    if (Number.isFinite(birthdayAudio.duration)) {
        progressBar.value =
            (birthdayAudio.currentTime / birthdayAudio.duration) * 100;
    }
});

progressBar.addEventListener("input", () => {
    if (Number.isFinite(birthdayAudio.duration)) {
        birthdayAudio.currentTime =
            (progressBar.value / 100) * birthdayAudio.duration;
    }
});