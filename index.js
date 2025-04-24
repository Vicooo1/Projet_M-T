import * as Tone from 'https://esm.sh/tone';

let osc;
let started = false;
let currentFreq = 440;
let updateInterval;
let waveType = "square";

const waveSelect = document.getElementById("waveSelect");

function mapYToFrequency(y) {
    const screenHeight = window.innerHeight;
    const minFreq = 100;
    const maxFreq = 1000;
    const percent = 1 - (y / screenHeight);
    return minFreq + percent * (maxFreq - minFreq);
}

async function démarrerOscillateur(y) {
    if (!started) {
        await Tone.start();
        started = true;
        console.log('Audio context démarré 🎧');
    }

    waveType = waveSelect.value;
    currentFreq = mapYToFrequency(y);

    osc = new Tone.Oscillator({
        type: waveType,
        frequency: currentFreq,
        volume: -10
    }).toDestination();

    osc.start();

    updateInterval = setInterval(() => {
        console.log(`🎶 ${waveType} : ${currentFreq.toFixed(2)} Hz`);
    }, 500);
}

function arrêterOscillateur() {
    if (osc) {
        osc.stop();
        osc.dispose();
        osc = null;
    }
    clearInterval(updateInterval);
}

function mettreÀJourFréquence(y) {
    if (osc) {
        currentFreq = mapYToFrequency(y);
        osc.frequency.value = currentFreq;
    }
}

// Événements souris
document.body.addEventListener("mousedown", e => démarrerOscillateur(e.clientY));
document.body.addEventListener("mouseup", arrêterOscillateur);
document.body.addEventListener("mouseleave", arrêterOscillateur);
document.body.addEventListener("mousemove", e => mettreÀJourFréquence(e.clientY));

// Événements tactiles
document.body.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    if (touch) démarrerOscillateur(touch.clientY);
});
document.body.addEventListener("touchend", arrêterOscillateur);
document.body.addEventListener("touchcancel", arrêterOscillateur);
document.body.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    if (touch) mettreÀJourFréquence(touch.clientY);
});
