import { browser } from '$app/environment';

let audio: HTMLAudioElement | null = null;
let soundEnabled = $state(true);

export function initAudio() {
    if (browser && !audio) {
        audio = new Audio('/audio/ambient.mp3');
        audio.loop = true;
        audio.volume = 0.5;

        audio.play()
    }
}

export function toggleSound() {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        audio?.play();
    } else {
        audio?.pause();
    }
    
    return soundEnabled;
}

export function getAudioState() {
    return soundEnabled;
}