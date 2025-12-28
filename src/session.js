import { PHASE_LABELS, PREP_TIME_MS, SCALE_IN, SCALE_OUT } from './consts.js';
import { dom } from './dom.js';

// Cache audio raz, zamiast tworzyć w obiekcie
const SOUNDS = {
  Wdech: new Audio('sounds/inhale.mp3'),
  Wydech: new Audio('sounds/exhale.mp3'),
  Zatrzymaj: new Audio('sounds/hold.mp3'),
};

let state = { rafId: null, soundOn: true, exercise: null };

// Funkcja pomocnicza do odtwarzania
const play = (label) => {
  if (!state.soundOn) return;
  const audio = SOUNDS[label] || SOUNDS.Zatrzymaj;
  audio.currentTime = 0;
  audio.play();
};

export const toggleSound = () => (state.soundOn = !state.soundOn);

export const stopSession = () => {
  cancelAnimationFrame(state.rafId);
  dom.timeLeft.textContent = '—';
  dom.phaseLabel.textContent = '';
  dom.breathCircle.style.transform = 'scale(1)';
  state.exercise = null;
};

export const startSession = (exercise) => {
  if (!exercise?.pattern) return;
  state.exercise = exercise;
  
  dom.sessionTitle.textContent = exercise.title;
  runPhase(-1); // -1 to faza przygotowania
};

function runPhase(phaseIndex) {
  // Obliczanie parametrów fazy
  const isPrep = phaseIndex === -1;
  const duration = isPrep ? PREP_TIME_MS / 1000 : state.exercise.pattern[phaseIndex];
  
  // UI i Dźwięk
  const label = isPrep ? 'Przygotuj się' : PHASE_LABELS[phaseIndex];
  const scale = label === 'Wdech' ? SCALE_IN : (label === 'Wydech' ? SCALE_OUT : 1);
  
  dom.phaseLabel.textContent = label;
  dom.breathCircle.style.transform = `scale(${scale})`;
  if (!isPrep) play(label);

  // Timer Loop
  const endTime = Date.now() + duration * 1000;
  let lastRenderedSec = -1;

  const loop = () => {
    const secondsLeft = Math.ceil((endTime - Date.now()) / 1000);

    // OPTYMALIZACJA: Aktualizuj DOM tylko gdy zmieniła się liczba
    if (secondsLeft !== lastRenderedSec) {
      dom.timeLeft.textContent = Math.max(0, secondsLeft);
      lastRenderedSec = secondsLeft;
    }

    if (secondsLeft <= 0) {
      // Przejście do kolejnej fazy (modulo zapętla ćwiczenie)
      const nextIdx = (phaseIndex + 1) % state.exercise.pattern.length;
      runPhase(nextIdx);
    } else {
      state.rafId = requestAnimationFrame(loop);
    }
  };

  loop();
}